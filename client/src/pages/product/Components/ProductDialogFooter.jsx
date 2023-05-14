import React from "react";
import { Button } from "primereact/button";

const  ProductDialogFooter = (props) => {
    return (
      // <React.Fragment>
      //   <Button
      //     label="Cancel"
      //     icon="pi pi-times"
      //     className="p-button-text"
      //     onClick={props.Cancel}
      //   />
      //   <Button
      //     label="Save"
      //     icon="pi pi-check"
      //     className="p-button-text"
      //     onClick={props.Save}
      //   />
      // </React.Fragment>
      <div className="w-3/5 flex justify-end mt-8">
        <Button
          icon="pi pi-check"
          label="Save"
          onClick={props.Save}
          className="mr-2"
        />
        <Button
          icon="pi pi-times"
          label="Cancel"
          severity="danger"
          outlined
          onClick={props.Cancel}
        />
      </div>
    );
 };

 export default  ProductDialogFooter;
