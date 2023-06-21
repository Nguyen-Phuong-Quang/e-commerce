import React from "react";
import { Button } from "primereact/button";

const ProductDialogFooter = (props) => {
    return (
        <div className="w-full flex justify-center mt-4 mb-4">
            <Button
                icon="pi pi-check"
                label="Save"
                severity="success"
                onClick={props.Save}
                className=" text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2 "
            />
            <Button
                icon="pi pi-times"
                label="Cancel"
                severity="secondary"
                onClick={props.Cancel}
                className="text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2 "
            />
        </div>
    );
};

export default ProductDialogFooter;
