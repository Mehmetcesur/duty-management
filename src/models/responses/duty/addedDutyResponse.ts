export default interface AddedDutyResponse {
    id: number;
    userName: string;
    title: string;
    description: string;
    status: 'New' | 'InProgress' | 'Completed';
    createdDate: string;
}
