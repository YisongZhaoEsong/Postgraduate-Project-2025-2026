using System.Collections;
using System.Collections.Generic;
using Unity.Profiling;
using UnityEngine;

public class Paddle : MonoBehaviour
{
    public SerialControllerTemplate serialInput;
    public Rigidbody2D rb2d;
    public BoxCollider2D coll2d;
    public int id;//witch paddle
    public float moveSpeed = 2f;

    //old coding paddle controll
    //[Header("Inversion (Player)")]
    //[Range(0f, 1f)]
    //public float invertChancePerSecond = 0.1f;
    //public float invertDuration = 5f; 

    //private float invertTimer = 0f;


    [Header("AI")]
    public float aiDeadzone = 1f;
    public float aiMoveSpeedMultiplierMin = 0.5f, aiMoveSpeedMultiplierMax = 1.5f; //AI speed random
    //fool or smart?
    public float mistakeMin = 0.01f;
    public float mistakeMax = 0.05f;

    private float currentMistake;

    private Vector3 startPosition;
    //AI
    private int direction = 0;
    private float moveSpeedMultiplier = 1f;
    //

    private const string MovePlayer1InputName = "MovePlayer1";//leftplayer
    private const string MovePlayer2InputName = "MovePlayer2";//rightplayer

    private void Start()
    {
        startPosition = transform.position;//mow paddle
        GameManager.instance.onReset += ResetPosition;
        RandomMistake();//Ai

    }

    //Ai:make the AI ​​perform differently in each game.
    private void RandomMistake()
    {
        currentMistake = Random.Range(mistakeMin, mistakeMax);
        //Debug.Log("[AI]currentMistake ="+currentMistake);
    }
    //

    private void ResetPosition()
    {
        transform.position = startPosition;
        //invertTimer = 0f;
        RandomMistake();
    }

    private void Update()
    {
        //if (invertTimer > 0f) invertTimer -= Time.deltaTime;


        if (IsAi())//AI
        {
            MoveAi();
        }
        else//people
        {
            //if (invertTimer <= 0f && Random.value < invertChancePerSecond * Time.deltaTime)
            //{
            //    invertTimer = invertDuration;
            //}

            float movement = GetInput();

            //Determine if the current rule is "upside down".
            if (RuleManager.Instance != null && RuleManager.Instance.currentRule == RuleType.InvertVertical)
            {
                movement *= -1f;
            }


            Move(movement);//rd2d y
        }
    }

    private bool IsAi()
    {
        //left or right?
        bool isPlayer1Ai = IsLeftPaddle() && GameManager.instance.IsPlayer1Ai();
        bool isPlayer2Ai = !IsLeftPaddle() && GameManager.instance.IsPlayer2Ai();
        return isPlayer1Ai || isPlayer2Ai;
    }

    private void MoveAi()
    {
        Vector2 ballPos = GameManager.instance.ball.transform.position;//get ball
        //Mistake
        if (Random.value < currentMistake)
        {
            ballPos.y += Random.Range(-2f, 2f);
        }
        //ball is up or down?
        if (Mathf.Abs(ballPos.y - transform.position.y) > aiDeadzone)
        {
            direction = ballPos.y > transform.position.y ? 1 : -1;
        }
        //moveSpeed
        if (Random.value < 0.01f)
        {
            moveSpeedMultiplier = Random.Range(aiMoveSpeedMultiplierMin, aiMoveSpeedMultiplierMax);
        } //The difficulty of combat has been reduced, with a 1% chance for the AI to be triggered.

        Move(direction); //use to control the ai direction(up and down)
    }

    private float GetInput()
    {
        if (IsLeftPaddle())
        {
            // [ADD] read from Arduino if assigned, otherwise fallback to keyboard
            if (serialInput != null) return serialInput.paddleValue;
            return Input.GetAxis(MovePlayer1InputName);
        }

        return Input.GetAxis(MovePlayer2InputName);
    }

    private void Move(float movement)
    {
        Vector2 velo = rb2d.linearVelocity;
        velo.y = moveSpeed * moveSpeedMultiplier * movement; //change the move speed
        rb2d.linearVelocity = velo;
    }

    //for ball
    public float GetHeight()
    {
        return coll2d.size.y;
    }

    public bool IsLeftPaddle()
    {
        return id == 1;
    }
}
