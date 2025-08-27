import { Modal } from "@mui/material";
import React from "react";
import { AlertTriangle, Info, AlertCircle, X, Trash, RotateCcw } from "lucide-react";

const dialogTypes = {
  danger: {
    bgColor: "bg-red-100",
    iconColor: "text-red-600",
    primaryBtnColor: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    icon: AlertTriangle,
  },
  warning: {
    bgColor: "bg-yellow-100", 
    iconColor: "text-yellow-600",
    primaryBtnColor: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
    icon: AlertCircle,
  },
  info: {
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600", 
    primaryBtnColor: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    icon: Info,
  },
};

export default function Dialog({
  open = false,
  type = "info",
  title = "Confirmation",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm = () => {},
  onCancel = () => {},
  onClose = () => {},
  showCloseButton = true,
  customIcon = null,
}) {
  const dialogConfig = dialogTypes[type] || dialogTypes.info;
  const IconComponent = customIcon || dialogConfig.icon;

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          ​
        </span>
        <div
          className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          {showCloseButton && (
            <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span className="sr-only">Close</span>
                <X className="h-6 w-6" />
              </button>
            </div>
          )}
          <div className="sm:flex sm:items-start">
            <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${dialogConfig.bgColor} sm:mx-0 sm:h-10 sm:w-10`}>
              <IconComponent className={`h-6 w-6 ${dialogConfig.iconColor}`} />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3
                className="text-lg leading-6 font-medium text-gray-900"
                id="modal-headline"
              >
                {title}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  {message}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onConfirm}
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${dialogConfig.primaryBtnColor} text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm`}
            >
              {confirmText}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
