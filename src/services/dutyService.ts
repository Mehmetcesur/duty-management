import Paginate from "../models/paginate";
import { BaseService } from "../core/services/baseServices";
import GetListDutyResponse from "../models/responses/duty/getListDutyResponse";
import AddDutyRequest from "../models/requests/duty/addDutyRequest";
import AddedDutyResponse from "../models/responses/duty/addedDutyResponse";
import UpdatedDutyResponse from "../models/responses/duty/updatedDutyResponse";
import DeleteDutyRequest from "../models/requests/duty/deleteDutyRequest";
import DeletedDutyResponse from "../models/responses/duty/deletedDutyResponse";
import UpdateDutyRequest from "../models/requests/duty/updateDutyRequest";
import { AxiosResponse } from "axios";
import axiosInstance from "../core/interceptors/axiosInterceptor";

class DutyService extends BaseService<
    Paginate<GetListDutyResponse>,
    GetListDutyResponse,
    AddDutyRequest,
    AddedDutyResponse,
    UpdateDutyRequest,
    UpdatedDutyResponse,
    DeleteDutyRequest,
    DeletedDutyResponse
> {
    constructor() {
        super();
        this.apiUrl = "Duties";
    }

    getTasksByUserId(userId: number, pageSize: number = 5, pageIndex: number = 0): Promise<AxiosResponse<Paginate<GetListDutyResponse>>> {
        return axiosInstance.get<Paginate<GetListDutyResponse>>(`${this.apiUrl}/GetByUserId?userId=${userId}&PageSize=${pageSize}&PageIndex=${pageIndex}`);
    }

    addTask(task: AddDutyRequest): Promise<AxiosResponse<AddedDutyResponse>> {
        return axiosInstance.post<AddedDutyResponse>(`${this.apiUrl}/Add`, task);
    }

    updateTask(task: UpdateDutyRequest): Promise<AxiosResponse<UpdatedDutyResponse>> {
        return axiosInstance.post<UpdatedDutyResponse>(`${this.apiUrl}/Update`, task);
    }

    deleteTask(id: number): Promise<AxiosResponse<DeletedDutyResponse>> {
        return axiosInstance.delete<DeletedDutyResponse>(`${this.apiUrl}/Delete?id=${id}`);
    }
    
}

export default new DutyService();

