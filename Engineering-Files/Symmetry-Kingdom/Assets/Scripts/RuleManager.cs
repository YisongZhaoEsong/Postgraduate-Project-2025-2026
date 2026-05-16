using System.Collections;
using System.Data;
using UnityEngine;

public enum RuleType
{
    Normal = 0,
    InvertVertical = 1,
    //ReverseSpeedMapping = 2,
    NoGuaranteedBounce = 3
}

public class RuleManager : MonoBehaviour
{
    public static RuleManager Instance { get; private set; }

    [Header("Timing (Random)")]
    //normal rule
    public float normalMin = 1f;
    public float normalMax = 2f;
    //change rule
    public float ruleMin = 1f;
    public float ruleMax = 2f;

    [Header("Current Rule")]
    public RuleType currentRule = RuleType.Normal;

    [Header("UI")]//text
    public RuleUI ruleUI;

    //save
    private Coroutine co;

    [Header("Stop")]
    public bool pauseOnAnnouncement = true;
    public float stopSeconds = 1.0f; //stop time

    private void Start()
    {
        //Debug.Log("[RuleManager] Start() called.");
        StartLoop();
    }

    //ensure thereis one manager
    private void Awake()
    {
        if (Instance != null && Instance != this)
        {
            Destroy(gameObject); return;
        }
        Instance = this;
    }

    public void StartLoop()
    {
        //Debug.Log("[RuleManager] StartLoop() called.);
        if (co != null) StopCoroutine(co);
        //new loop
        co = StartCoroutine(Loop());

    }

    private IEnumerator Loop()
    {
        //Debug.Log("[RuleManager] Enter Loop()");
        while (true)
        {
            //normal
            //Debug.Log("[RuleManager] Phase: Normal");
            SetRule(RuleType.Normal);
            yield return new WaitForSeconds(Random.Range(normalMin, normalMax));

            //rule 1 or 2
            RuleType next = Random.value < 0.5f ? RuleType.InvertVertical : RuleType.NoGuaranteedBounce;
            //Debug.Log("[RuleManager] Phase: Rule);
            SetRule(next);

            //how long
            yield return new WaitForSeconds(Random.Range(ruleMin, ruleMax));

            //reset
            //Debug.Log("[RuleManager] Phase: Restore");
            SetRule(RuleType.Normal);
            yield return new WaitForSeconds(Random.Range(3f, 8f));

        }
    }

    private void SetRule(RuleType rule)
    {
        //Debug.Log("[RuleManager] SetRule called);

        if (currentRule == rule) return;
        currentRule = rule;

        if (ruleUI == null) return;

        //text
        string msg = (rule == RuleType.Normal)
        ? "SYSTEM UPDATE\nRule Restored: Default State"
        : "SYSTEM UPDATE\nRule Modified: " + RuleName(rule);

        //send text
        ruleUI.ShowMessage(msg);

        //rule stop
        if (pauseOnAnnouncement)
        {
            StartCoroutine(timeStop());
        }
    }

    private IEnumerator timeStop()
    {
        Time.timeScale = 0f; // stop gamemovement
        yield return new WaitForSeconds(stopSeconds); // realtime
        Time.timeScale = 1f;
    }

    private string RuleName(RuleType rule)
    {
        return rule switch
        {
            RuleType.InvertVertical => "Vertical Axis Inverted",
            RuleType.NoGuaranteedBounce => "Collision Outcome No Longer Guaranteed",
            _ => "Default State"
        };
    }
}
