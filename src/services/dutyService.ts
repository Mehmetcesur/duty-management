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

    getTasksByUserId(userId: number): Promise<AxiosResponse<Paginate<GetListDutyResponse>>> {
        return axiosInstance.get<Paginate<GetListDutyResponse>>(`${this.apiUrl}/GetByUserId?userId=${userId}`);
    }
}

export default new DutyService();
