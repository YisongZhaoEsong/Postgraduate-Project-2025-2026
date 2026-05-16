using UnityEngine;

public class MiddlePaddleMover : MonoBehaviour
{
    public Rigidbody2D rb2d;

    [Header("Speed")]
    public float speed = 2.5f;

    [Tooltip("Movement range")]
    public float minY = -3.5f;
    public float maxY = 3.5f;

    private int dir = 1;

    private void Reset()
    {
        rb2d = GetComponent<Rigidbody2D>();//Rigidbody2D
    }

    private void FUpdate()
    {
        float y = rb2d.position.y;//now y

        if (y >= maxY)
        {
            dir = -1;
        }
        else if (y <= minY)
        {
            dir = 1;
        }

        rb2d.linearVelocity = new Vector2(0f, dir * speed);
    }
}