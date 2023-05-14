import React from "react";
import { Button } from "primereact/button";

const LeftToolbarTemplate = (handleAddClick, deleteMode) => {
    return (
      <React.Fragment>
        <Button
          label="Add"
          icon="pi pi-plus"
          className="p-button-success mr-2"
          onClick={handleAddClick}
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          className="p-button-danger"
          onClick={deleteMode}
          // disabled={!props.selectedProduct || !props.selectedProduct.length}
        />
      </React.Fragment>
    )
  };

  export default LeftToolbarTemplate;