export default interface UpdateDutyRequest {
    id: number;
    userId?: number; // İsteğe bağlı hale getirildi
    title: string;
    description: string;
    status: number;
}
