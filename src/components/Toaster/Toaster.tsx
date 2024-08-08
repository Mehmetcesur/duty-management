import { toast } from 'react-toastify';
import './Toaster.css';
import 'react-toastify/dist/ReactToastify.css';

const CustomToaster = (props: any) => (
    <div>
        <div className="customCopyToast">
            <img src={"./public/assets/report.png"}
                alt="ReportingSystemIcon" />
            <span> Reporting System</span>
        </div>
        <div className="customCopyToastUrl">
            <span>{props.name}</span>
        </div>
    </div>
);

const Toaster = (props: any) => {
    return (
        toast.success(<CustomToaster name={props.name} />, {
            autoClose: 3000,
            theme: "light",
            position: "top-right",
            hideProgressBar: true,
            icon: false,
            className: "copyToast",
        })
    );
};

export default Toaster;
