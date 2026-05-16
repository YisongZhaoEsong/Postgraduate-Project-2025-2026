using System.Collections;
using TMPro;
using UnityEngine;

public class RuleUI : MonoBehaviour
{
    [Header("UI")]
    public GameObject panel;
    public TMP_Text text;

    public float showSeconds = 1f;

    private Coroutine co;

    //private void Start()
    //{
    //    ShowMessage("TEST");
    //}


    private void Awake()
    {
        if (panel != null)
        {
            panel.SetActive(false);//hide
        }
    }

    public void ShowMessage(string msg)
    {
        //stop old
        if (co != null) StopCoroutine(co);
        co = StartCoroutine(ShowCo(msg));
    }

    private IEnumerator ShowCo(string msg)
    {
        panel.SetActive(true);//open
        text.text = msg;//text
        text.gameObject.SetActive(true);//open text

        yield return new WaitForSeconds(showSeconds);//wait

        panel.SetActive(false);//hide
        co = null;//clear
    }
}