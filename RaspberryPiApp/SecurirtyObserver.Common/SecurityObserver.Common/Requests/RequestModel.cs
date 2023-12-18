namespace SecurityObserver.Common.Requests;

public class RequestModel
{
    public string RequestPath { get; set; }

    public Type? RequestHeaderContent { get; set; }

    public Type? RequestBodyContent { get; set; }

    public Type? ResponseHeaderContent { get; set; }

    public Type? ResponseBodyContent { get; set; }
}
