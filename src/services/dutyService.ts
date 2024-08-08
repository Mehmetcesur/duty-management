import Paginate from "../models/paginate";
import { BaseService } from "../core/services/baseServices";
import GetListDutyResponse from "../models/responses/duty/getListDutyResponse";
import AddDutyRequest from "../models/requests/duty/addDutyRequest";
import AddedDutyResponse from "../models/responses/duty/addedDutyResponse";
import UpdatedDutyResponse from "../models/responses/duty/updatedDutyResponse";
import DeleteDutyRequest from "../models/requests/duty/deleteDutyRequest";
import DeletedDutyResponse from "../models/responses/duty/deletedDutyResponse";
import UpdateDutyRequest from "../models/requests/duty/updateDutyRequest";


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
}


export default new DutyService();