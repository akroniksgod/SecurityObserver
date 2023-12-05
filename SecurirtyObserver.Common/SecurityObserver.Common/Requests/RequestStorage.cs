namespace SecurityObserver.Common.Requests;

/// <summary>
/// Хранит пути запросов. Создан, чтобы они были унифицированы для всех частей проекта.
/// </summary>
public class RequestStorage
{
    #region Запросы для приложения RaspberryPI

    /// <summary>
    /// Получает QR code в виде строки, должен возвращать логическое значение true, если проход раазрешен.
    /// </summary>
    public RequestModel CheckCode => new RequestModel()
    {
        RequestPath = "/api/CheckQrCode/code={code}",
        RequestHeaderContent = typeof(string),
        RequestBodyContent = null,
        ResponseHeaderContent = typeof(bool),
        ResponseBodyContent = null,
    };

    #endregion
}
