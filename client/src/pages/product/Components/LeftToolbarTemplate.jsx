import React from "react";
import { Button } from "primereact/button";

const LeftToolbarTemplate = (props) => {
    return (
      <React.Fragment>
        <Button
          label="Add new"
          icon="pi pi-plus"
          className="p-button-success mr-2"
          onClick={props.handleAddClick}
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          className="p-button-danger"
          onClick={props.delete}
          disabled={!props.selectedProduct || !props.selectedProduct.length}
        />
      </React.Fragment>
    )
  };

  export default LeftToolbarTemplate;