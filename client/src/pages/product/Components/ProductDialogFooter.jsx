import React from "react";
import { Button } from "primereact/button";

const  ProductDialogFooter = (props) => {
    return (
    <React.Fragment>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={props.Cancel}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        className="p-button-text"
        onClick={props.Save}
      />
    </React.Fragment>
    )
 };

 export default  ProductDialogFooter;
