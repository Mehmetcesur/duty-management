export default interface getListDutyResponse {
    id: number;
    userId: number;  // Bu alanın tanımlı olduğundan emin olun
    title: string;
    description: string;
    createdDate: string;
    status: string;
}