import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import { InputNumber } from "primereact/inputnumber";
import discountApi from "./../../api/discountApi";
import { toastContext } from "./../../contexts/ToastProvider";
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from "primereact/card";
import ProductDialogFooter from "../product/Components/ProductDialogFooter";
import { Navigate, useNavigate } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toolbar } from "primereact/toolbar";

export default function Discountpage() {
  const navigate = useNavigate();
  const [visibleDialog, setVisibleDialog] = useState(false);
  const { toastError, toastSuccess } = toastContext();
  const [loading, setLoading] = useState(false);
  const [discount, setDiscount] = useState({
    codeLength: null,
    available: null,
    discountValue: null,
    discountUnit: "₫",
    startDate: null,
    validUntil: null,
    minOrderValue: null,
    maxDiscountAmount: null,
  });

  const discountCodeExample = [
    {
      code: "DISCOUNT123",
      discountValue: 10,
      discountUnit: "%",
      validUntil: "2023-12-31",
      minOrderValue: 100,
      maxDiscountAmount: 50,
      available: 17,
    },
    {
      code: "DISCOUNT456",
      discountValue: 13,
      discountUnit: "%",
      validUntil: "2023-12-31",
      minOrderValue: 100,
      maxDiscountAmount: 50,
      available: 15,
    },
    // Các mã giảm giá khác...
    {
      code: "DISCOUNT456",
      discountValue: 13,
      discountUnit: "%",
      validUntil: "2023-12-31",
      minOrderValue: 100,
      maxDiscountAmount: 50,
      available: 14,
    },
    {
      code: "DISCOUNT456",
      discountValue: 13,
      discountUnit: "%",
      validUntil: "2023-12-31",
      minOrderValue: 100,
      maxDiscountAmount: 50,
      available: 13,
    },
    {
      code: "DISCOUNT456",
      discountValue: 13,
      discountUnit: "%",
      validUntil: "2023-12-31",
      minOrderValue: 100,
      maxDiscountAmount: 50,
      available: 11,
    },
    {
      code: "DISCOUNT456",
      discountValue: 13,
      discountUnit: "%",
      validUntil: "2023-12-31",
      minOrderValue: 100,
      maxDiscountAmount: 50,
      available: 12,
    },
  ];

  const [discountCodes, setDiscountCodes] = useState([]);

  const actionBodyTemplate = (rowData) => {
    return (
        <>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editCategory(rowData)} /> {" "}
            <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteCategory(rowData)} />
        </>
    );
  }

  useEffect(() => {
    const fetchDiscountCodes = async () => {
      try {
        // const response = await discountApi.getAllDiscount();
        // setDiscountCodes(response.data);
        setDiscountCodes(discountCodeExample);
      } catch (err) {
        toastError(err);
      }
    };
    fetchDiscountCodes();
  }, []);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setDiscount((values) => ({ ...values, [name]: value }));
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      const response = await discountApi.createDiscount({ ...discount });
      //if (response.data.type === "Success") {
      // navigate("/admin");
      toastSuccess("Create discount code complete!!!");
      // }
    } catch (err) {
      //toastError(err.response.data.message);
      toastError("Chua co API");
      console.log("Chua co api");
    }
    setLoading(false);
  };

  return (
    <>
      {loading && (
        <div className="w-full h-[600px] flex justify-center items-center">
          <ProgressSpinner className=" w-full" />
        </div>
      )}
      {!loading && (
        //   <div>
        //   <h1 className='p-4'>Hi, It is discount page of product seller</h1>
        //   <Button
        //   icon="pi pi-plus"
        //   label='Create new discount code'
        //   severity='success'
        //   onClick={() => {setVisibleDialog(true)}}
        //   className='ml-4'
        //   />
        // </div>
        <div>
          {/* <h1 className="text-2xl font-bold mb-4">List discount code</h1>
          <h1 className="p-4">Hi, It is discount page of product seller</h1>
          <Button
            icon="pi pi-plus"
            label="Create new discount code"
            severity="success"
            onClick={() => {
              setVisibleDialog(true);
            }}
            className="ml-4"
          /> */}
          <Toolbar
            className="mb-4"
            left={
              <>
                <button
                  type="button"
                  class="px-4 py-2 bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 text-white rounded-md shadow-md"
                  onClick={() => {
                    setVisibleDialog(true);
                  }}
                >
                  <i class="pi pi-plus mr-1"></i>Add
                </button>
              </>
            }
          ></Toolbar>
          {discountCodes.length === 0 ? (
            <p className="flex items-center justify-center">
              Discount codes are not found!
            </p>
          ) : (
            <div className="p-d-flex p-justify-center">
              <DataTable value={discountCodes} rows={10} paginator dataKey="id" rowsPerPageOptions={[5,10,15]} className="p-datatable-striped">
                <Column field="code" header="Code"></Column>
                <Column field="discountValue" header="Discount Value"></Column>
                <Column field="discountUnit" header="Discount Unit"></Column>
                <Column field="validUntil" header="Valid Until"></Column>
                <Column field="minOrderValue" header="Min Order Value"></Column>
                <Column
                  field="maxDiscountAmount"
                  header="Max Discount Amount"
                ></Column>
                <Column field="available" header="Available"></Column>
                <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>

              </DataTable>
            </div>
          )}
        </div>
      )}

      {visibleDialog && (
        <Dialog
          header="New discount code"
          visible={visibleDialog}
          onHide={() => setVisibleDialog(false)}
          className="w-1/2 h-auto"
          footer={
            <ProductDialogFooter
              Cancel={() => {
                setVisibleDialog(false);
              }}
              Save={handleCreate}
            />
          }
        >
          <div className=" p-8">
            {/* 
                <div className="bg-white shadow-md rounded px-8 pt-8 pb-8 mb-4 mt-4 w-2/3"> */}

            <div className="mb-8 flex flex-row items-center">
              <label
                className="basis-1/3 block text-gray-700 font-bold mb-2 text-right "
                htmlFor="codeLength"
              >
                Code Length
              </label>
              <InputNumber
                id="codeLength"
                name="codeLength"
                placeholder="Enter code length"
                value={discount.codeLength}
                className="w-full basis-2/3 ml-8"
                onValueChange={handleChange}
              />
            </div>

            <div className="mb-8 flex flex-row items-center">
              <label
                className="basis-1/3 block text-gray-700 font-bold mb-2 text-right "
                htmlFor="available"
              >
                Available
              </label>
              <InputNumber
                id="available"
                name="available"
                placeholder="Enter available code"
                value={discount.available}
                className="w-full basis-2/3 ml-8"
                onValueChange={handleChange}
              />
            </div>
            <div className="mb-8 flex flex-row items-center">
              <label
                className="basis-1/3 block text-gray-700 font-bold mb-2 text-right"
                htmlFor="discountUnit"
              >
                Discount Value | Discount Unit
              </label>
              <div className="basis-2/3 ml-8 flex flex-row items-center">
                <InputNumber
                  id="discountValue"
                  name="discountValue"
                  placeholder="Enter discount value"
                  value={discount.discountValue}
                  onValueChange={handleChange}
                  className="w-full basis-2/3 mr-4"
                />
                <Dropdown
                  id="discountUnit"
                  name="discountUnit"
                  value={discount.discountUnit}
                  onChange={handleChange}
                  options={["$", "%", "₫"]}
                  className="w-full basis-1/3 ml-4"
                />
              </div>
            </div>

            <div className="mb-8 flex flex-row items-center">
              <label
                className="basis-1/3 block text-gray-700 font-bold mb-2 text-right"
                htmlFor="validUntil"
              >
                 Valid Until
              </label>
              <div className="basis-2/3 ml-8 flex flex-row items-center justify-between">
                <Calendar
                  id="validUntil"
                  name="validUntil"
                  placeholder="Choose end date"
                  value={discount.validUntil}
                  onChange={handleChange}
                  showIcon
                  className="w-full bg-blue-400 basis-2/3   rounded"
                />
              </div>
            </div>
            <div className="mb-8 flex flex-row items-center">
              <label
                className="basis-1/3 block text-gray-700 font-bold mb-2 text-right"
                htmlFor="minOrderValue"
              >
                Min Order Value
              </label>
              <InputNumber
                id="minOrderValue"
                name="minOrderValue"
                placeholder="Enter min order value"
                value={discount.minOrderValue}
                onValueChange={handleChange}
                className="w-full basis-2/3 ml-8"
              />
            </div>
            <div className="mb-8 flex flex-row items-center">
              <label
                className="basis-1/3 block text-gray-700 font-bold mb-2 text-right"
                htmlFor="maxDiscountAmount"
              >
                Max Discount Amount
              </label>
              <InputNumber
                id="maxDiscountAmount"
                name="maxDiscountAmount"
                placeholder="Enter max discount amount"
                value={discount.maxDiscountAmount}
                onValueChange={handleChange}
                className="w-full basis-2/3 ml-8"
              />
            </div>
          </div>
          {/* </div> */}
        </Dialog>
      )}
    </>
  );
}
