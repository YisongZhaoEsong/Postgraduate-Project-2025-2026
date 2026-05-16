using TMPro;
using UnityEngine;
using UnityEngine.Events;

public class IntroUI : MonoBehaviour
{
    [Header("UI")]
    public GameObject introPanel;
    public TMP_Text introText;

    [Header("Config")]
    [TextArea(6, 20)]
    public string storyText =
@"在对称王国里，
每一场比赛都完美无误。

球按照角度反弹，
力量按照比例增加，
向上永远是向上。

人们相信，这是世界的自然规律。
他们从未见过制定规则的人。

直到有一天，
球在碰到挡板后没有反弹，
而是直直坠落。

有人说那是意外。

但后来，
向上的指令偶尔变成向下，
用力越大却走得越慢。

人们开始怀疑。

也许世界从来不是自然运行的。
也许规则，只是被维护的秩序。";

    [Header("Events")]
    public UnityEvent onIntroFinished;

    private bool isShowing = false;

    private void Start()
    {
        if (introPanel != null) introPanel.SetActive(false);
    }

    public void Show()
    {
        if (introPanel != null) introPanel.SetActive(true);
        if (introText != null) introText.text = storyText;

        isShowing = true;

        Time.timeScale = 0f;
    }

    private void Update()
    {
        if (!isShowing) return;

        if (Input.GetKeyDown(KeyCode.Space) || Input.GetMouseButtonDown(0))
        {
            HideAndStart();
        }
    }

    public void HideAndStart()
    {
        isShowing = false;

        if (introPanel != null) introPanel.SetActive(false);

        Time.timeScale = 1f;

        onIntroFinished?.Invoke();
    }
}
