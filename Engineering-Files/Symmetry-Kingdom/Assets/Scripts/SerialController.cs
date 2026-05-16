using UnityEngine;
using System.IO.Ports;
using System.Threading;
using System.Collections.Concurrent;
using System;

public class SerialControllerTemplate: MonoBehaviour
{
    [SerializeField]
    private string portName;
   public float paddleValue = 0f;
    [SerializeField]
    private int baudRate = 9600;
    [SerializeField]
    private Light lightToControl;
    private SerialPort serialPort;
    private Thread serialThread;
    private bool running;

    private ConcurrentQueue<string> queue = new();
    public string PortName => portName;
    public string lastRawLine = "";

    void Start()
    {
        // List available ports for debugging
        string[] ports = SerialPort.GetPortNames();
        Debug.Log($"Available ports: {string.Join(", ", ports)}");

        if (string.IsNullOrEmpty(portName))
        {
            Debug.LogError("No serial port selected!");
            return;
        }

        try
        {
            serialPort = new SerialPort(portName, baudRate)
            {
                ReadTimeout = 500,
                NewLine = "\n",
                DtrEnable = true,
                RtsEnable = true
            };
            serialPort.Open();
            // Wait for Arduino to reset after serial connection
            Thread.Sleep(2000);
            Debug.Log($"Successfully opened port {portName} at {baudRate} baud");
        }
        catch (Exception e)
        {
            Debug.LogError($"Failed to open serial port {portName}: {e.Message}");
            return;
        }

        running = true;
        serialThread = new Thread(ReadSerial);
        serialThread.Start();
        Debug.Log("Serial thread started");
    }

    void Update()
    {
        string newLine = null;
        while (queue.TryDequeue(out string line))
        {
            newLine = line;
        }

        if (newLine != null)
        {
            lastRawLine =newLine;
            // Debug.Log(newLine);
            float value = ProcessLine(newLine);
            paddleValue = value;
            // retrive a new data frame, do your caculation and apply the value here
            /* example
            float newPosition = ProcessLine(newLine);

            // add mapping, clamping, or even filter before applying the value
                  
            positionToControl.position.y = position;
            */
        }
    }

    void OnDestroy()
    {
        running = false;

        if (serialThread != null && serialThread.IsAlive)
            serialThread.Join();

        if (serialPort != null && serialPort.IsOpen)
            serialPort.Close();
    }

    void ReadSerial()
    {
        Debug.Log("ReadSerial thread running");
        int readCount = 0;
        int timeoutCount = 0;
        
        while (running && serialPort != null && serialPort.IsOpen)
        {
            try
            {
               string line = serialPort.ReadLine();
               readCount++;
               if (!string.IsNullOrEmpty(line))
               {
                queue.Enqueue(line);
                 if (readCount % 50== 0)
                  {
                    Debug.Log($"Read {readCount} lines, {timeoutCount} timeouts");
                    }
                  
                }
            }
            catch (System.TimeoutException) 
            { 
                timeoutCount++;
                
            }
            catch (Exception e)
            {
                Debug.LogError($"Error reading serial: {e.Message}");
                break;
            }
        }
        Debug.Log($"ReadSerial thread ended. Total reads: {readCount}, timeouts: {timeoutCount}");
    }

    float ProcessLine(string line)
    {
        line = line.Trim();
        string[] parts = line.Split('\t');
        if (parts.Length < 6)
        return 0f;
        if(!int.TryParse(parts[1],out int value2))
        return 0f;


       float v = Mathf.Clamp(value2 / 16000f, -1f, 1f);
       return v;
        // try
        // {
        //     Debug.Log($"Received: {line}");
        //     string[] parts = line.Split('\t');

        //     if (parts.Length < 2)
        //     {
        //         Debug.LogWarning($"Expected at least 2 parts, got {parts.Length}: {line}");
        //         return 0.1f;
        //     }

        //     int bat1 = int.Parse(parts[0]);
        //     int bat2 = int.Parse(parts[1]);

        //     Debug.Log($"Bat1: {bat1}, Bat2: {bat2}");

        //     return bat1 / 4095f;
        // }
        // catch (Exception e)
        // {
        //     Debug.LogError($"Error parsing line '{line}': {e.Message}");
        //     return 0.1f;
        // }
    }
}