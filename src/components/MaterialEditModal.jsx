import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useEffect, useState } from "react";
import moment from "moment-timezone";
export default function MaterialEditModal({ isOpen, onClose, data, onSave }) {
    const [formData, setFormData] = useState({});
    // const datetimeFields = [
    //     "DateChanged_Material",
    //     "DateChanged_MaterialSupplier",
    //     "DateCreated_Material",
    //     "DateCreated_MaterialSupplier"
    // ];

    useEffect(() => {
        setFormData(data || {});
    }, [data]);

    const handleChange = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = () => {
        const dataToSave = { ...formData };

        //     datetimeFields.forEach((field) => {
        //         if (dataToSave[field]) {
        //             dataToSave[field] = toMySQLDatetime(dataToSave[field]);
        //         }
        //     }
        // );
        onSave(dataToSave);
        onClose();
    };

    function toInputDatetimeLocal(value) {
        if (!value) return "";
        return moment.tz(value, "Asia/Bangkok").format("YYYY-MM-DDTHH:mm:ss");
    }
    function toMySQLDatetime(value) {
        return moment.tz(value, "Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss");
    }
    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-[var(--button-bg)] text-[var(--button-text)] w-10 h-10 rounded-md flex items-center justify-center hover:bg-[var(--button-hover-bg)] z-10"
                >
                    X
                </button>
                <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true" />

                <DialogPanel className="bg-[var(--background)] text-[var(--font-color)] relative  rounded-lg max-h-[80vh] w-full max-w-5xl overflow-y-auto p-6 shadow-xl">
                    <DialogTitle className="text-3xl font-bold mb-4 text-center text-[var(--accent-color)]">Edit Material</DialogTitle>

                    <div className="space-y-2">
                        {Object.entries(formData).map(([key, value]) => {
                            if (key === 'id') {
                                return (
                                    <div key={key} className="grid grid-cols-2 gap-4 border-b py-1 text-sm ">
                                        <label className="font-semibold text-[var(--font-color)] ">{key}</label>
                                        <input
                                            className="border p-1 rounded bg-gray-400"
                                            type="text"
                                            value={value || ""}
                                            disabled
                                            readOnly
                                        />
                                    </div>
                                );
                            }

                            // const isDatetime = datetimeFields.includes(key);
                            const isLongValue = typeof value === 'string' && value.length > 50;

                            return (
                                <div key={key} className="grid grid-cols-2 gap-4 sm:border-b py-1 text-sm items-start sm:grid-cols-2 ">
                                    <label className="font-semibold text-[var(--font-color)] mt-1 col-span-2 sm:col-span-1">
                                        {key}
                                    </label>
                                    <div className="col-span-2 sm:col-span-1">
                                        {isLongValue ? (
                                            <textarea
                                                className="border p-2 rounded w-full min-h-[80px] resize-y"
                                                value={value || ""}
                                                onChange={(e) => handleChange(key, e.target.value)}
                                            />
                                        ) : (
                                            <input
                                                className="border p-1 rounded w-full"
                                                type="text"
                                                value={value || ""}
                                                onChange={(e) => handleChange(key, e.target.value)}
                                            />
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                    </div>

                    <div className="mt-6 flex justify-end gap-2">
                        <button onClick={onClose} className="bg-red-500 text-[var(--button-text)] px-4 py-2 rounded hover:bg-red-600">
                            Cancel
                        </button>
                        <button onClick={handleSubmit} className="bg-[var(--button-bg)] text-[var(--button-text)] px-4 py-2 rounded hover:bg-[var(--button-hover-bg)]">
                            Save
                        </button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}
