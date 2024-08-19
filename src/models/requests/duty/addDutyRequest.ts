export default interface AddDutyRequest {
        userId: number;              // Görevi ekleyen kullanıcının ID'si
        title: string;               // Görevin başlığı
        description: string;         // Görevin açıklaması
        status: number;              // Görevin durumu (1: New, 2: InProgress, 3: Completed gibi)
    }
    