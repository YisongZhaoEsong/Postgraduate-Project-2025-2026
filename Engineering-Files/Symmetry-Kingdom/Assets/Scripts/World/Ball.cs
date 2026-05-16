using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Ball : MonoBehaviour
{
    [Header("Refs")]
    public Rigidbody2D rb2d;
    public SpriteRenderer spriteRenderer;
    public BallAudio ballAudio;
    public ParticleSystem collisionParticle;

    [Header("Config")]
    [Range(0f, 1f)]
    public float maxInitialAngle = 0.67f; //y move
    [Tooltip("The maximum ball angle after colliding with a paddle")]
    public float maxCollisionAngle = 45f; //moveAngle
    [Space]
    public float moveSpeed = 1f; //basic speed
    public float maxStartY = 4f; //reset
    //[SerializeField]
    //private float speedMultiplier = 1.1f;

    [Header("Wall Chaos")]
    public float wallSpeedMultiplier = 1.25f;
    public float wallAngleJitter = 60f;
    public float maxBallSpeed = 20f; //biggest speed

    [Header("Different")]
    [Range(0.8f, 1f)]
    public float slowDownMultiplier = 0.95f;//slight deceleration
    public float minBallSpeed = 3f;//ensure the ball doesn't slow down to almost stop

    [Header("Paddle Drop Randomness")]
    [Range(0f, 1f)]
    public float paddleDropChance = 0.12f;//probability
    public float dropLong = 5f;//how long
    public float dropSpeed = 5f;
    public float bounceUpMultiplier = 0.9f;
    private bool isDropping = false;

    //from middle
    private float startX = 0f;

    //reset
    private void Start()
    {
        GameManager.instance.onReset += ResetBall;
        GameManager.instance.gameUI.onStartGame += ResetBall;
    }

    private void ResetBall()
    {
        ResetBallPosition();
        InitialPush();
    }

    private void InitialPush()
    {
        //right or left?
        Vector2 dir = Random.value < 0.5f ? Vector2.left : Vector2.right;

        //random Y
        dir.y = Random.Range(-maxInitialAngle, maxInitialAngle);


        //start speed
        rb2d.linearVelocity = dir * moveSpeed;

        //Art
        EmitParticle(32);
    }

    //x = 0 and y = random
    private void ResetBallPosition()
    {
        float posY = Random.Range(-maxStartY, maxStartY);
        Vector2 position = new Vector2(startX, posY);
        transform.position = position;
    }

    //get score
    private void OnTriggerEnter2D(Collider2D collision)
    {
        ScoreZone scoreZone = collision.GetComponent<ScoreZone>();
        if (scoreZone)
        {
            GameManager.instance.OnScoreZoneReached(scoreZone.id);
            //Art
            GameManager.instance.screenshake.StartShake(0.33f, 0.1f);
        }
    }

    private void OnCollisionEnter2D(Collision2D collision)
    {
        if (isDropping) return; //protect change rule

        //? paddle
        Paddle paddle = collision.collider.GetComponent<Paddle>();
        if (paddle)
        {
            //Debug.Log("HIT PADDLE: " + collision.collider.name);

            ballAudio.PlayPaddleSound();
            // rb2d.linearVelocity *= speedMultiplier;
            rb2d.linearVelocity *= slowDownMultiplier;

            //if ball is too slow
            if (rb2d.linearVelocity.magnitude < minBallSpeed)
            {
                rb2d.linearVelocity = rb2d.linearVelocity.normalized * minBallSpeed;
            }

            //Art
            EmitParticle(16);

            //if !dorp?
            bool noBounceRule = RuleManager.Instance != null && RuleManager.Instance.currentRule == RuleType.NoGuaranteedBounce;

            // change rule 3: only ball drop
            if (noBounceRule && Random.value < paddleDropChance)
            {
                Debug.Log("DROP TRIGGERED (Rule3)");
                StartCoroutine(DropThenBounce(paddle));

                AdjustSpriteRotation();
                return;
            }

            //!drop
            AdjustAngle(paddle, collision);
            GameManager.instance.screenshake.StartShake(Mathf.Sqrt(rb2d.linearVelocity.magnitude) * 0.02f, 0.075f);
        }

        //if !wall?
        Wall wall = collision.collider.GetComponent<Wall>();
        if (wall)
        {
            ballAudio.PlayWallSound();
            EmitParticle(8);
            AdjustWallBounce(collision);
            GameManager.instance.screenshake.StartShake(0.033f, 0.033f);
        }

        AdjustSpriteRotation();
    }

    private void AdjustAngle(Paddle paddle, Collision2D collision)
    {
        Vector2 median = Vector2.zero;
        foreach (ContactPoint2D point in collision.contacts)
        {
            median += point.point;
        }
        median /= collision.contactCount;

        float absoluteDistanceFromCenter = median.y - paddle.transform.position.y;
        float relativeDistanceFromCenter = absoluteDistanceFromCenter * 2 / paddle.GetHeight();

        int angleSign = paddle.IsLeftPaddle() ? 1 : -1;
        float angle = relativeDistanceFromCenter * maxCollisionAngle * angleSign;
        Quaternion rot = Quaternion.AngleAxis(angle, Vector3.forward);

        Vector2 dir = paddle.IsLeftPaddle() ? Vector2.right : Vector2.left;
        Vector2 velocity = rot * dir * rb2d.linearVelocity.magnitude;
        rb2d.linearVelocity = velocity;
    }

    private void AdjustWallBounce(Collision2D collision)
    {
        Vector2 normal = collision.GetContact(0).normal;
        Vector2 v = rb2d.linearVelocity;
        Vector2 reflected = Vector2.Reflect(v, normal);

        //controll speed
        float newSpeed = reflected.magnitude * wallSpeedMultiplier;
        newSpeed = Mathf.Min(newSpeed, maxBallSpeed);

        //random angle
        float jitter = Random.Range(-wallAngleJitter, wallAngleJitter);
        Vector2 chaoticDir = ((Vector2)(Quaternion.AngleAxis(jitter, Vector3.forward) * reflected)).normalized;

        rb2d.linearVelocity = chaoticDir * newSpeed;
    }

    private void AdjustSpriteRotation()
    {
        spriteRenderer.flipY = rb2d.linearVelocity.x < 0f;
    }

    private void EmitParticle(int amount)
    {
        collisionParticle.Emit(amount);
    }

    //change rule
    private IEnumerator DropThenBounce(Paddle paddle)
    {
        isDropping = true;


        float x = Mathf.Sign(rb2d.linearVelocity.x);
        if (x == 0f) x = paddle.IsLeftPaddle() ? 1f : -1f;

        rb2d.linearVelocity = new Vector2(0f, -dropSpeed);//lose gravity


        yield return new WaitForSeconds(dropLong);//wait time

        //return
        float horizontalDir = paddle.IsLeftPaddle() ? 1f : -1f;
        Vector2 dir = new Vector2(horizontalDir, 1f).normalized;
        rb2d.linearVelocity = dir * (Mathf.Max(minBallSpeed, dropSpeed) * bounceUpMultiplier);



        //out change
        isDropping = false;
    }

}
