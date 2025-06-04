'use client';

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';

export default function MaterialInfoModal({ isOpen, onClose, data }) {
    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">

            <div className="flex items-center justify-center min-h-screen px-4">
                {/* Overlay */}
                {/* ❌ Nút X cố định ở góc trên trái */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-gray-600 text-white w-10 h-10 rounded-md flex items-center justify-center hover:bg-gray-800 z-10"
                >
                    X
                </button>
                <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true" />

                <DialogPanel className="relative bg-white rounded-lg max-h-[80vh] w-full max-w-5xl overflow-y-auto p-6 shadow-xl">

                    <DialogTitle className="flex text-3xl font-bold mb-4 items-center justify-center">
                        Thông tin vật liệu
                    </DialogTitle>

                    {/* Ảnh vật liệu */}
                    {data?.Image_URL && (
                        <div className="flex justify-center mb-6">
                            <img
                                src={data.Image_URL.startsWith('http') ? data.Image_URL : `${data.Image_URL}`}
                                alt="Ảnh vật liệu"
                                className="max-h-60 object-contain rounded"
                            />
                        </div>
                    )}

                    {/* Thông tin chi tiết */}
                    <div className="space-y-2">
                        {Object.entries(data).map(([key, value]) => {
                            // Bỏ qua Image_URL khỏi phần danh sách thông tin
                            if (key === 'Image_URL') return null;
                            return (
                                <div key={key} className="grid grid-cols-2 gap-4 border-b py-1 text-sm">
                                    <div className="text-gray-700 font-bold break-words">{key}</div>
                                    <div className="text-gray-900 break-words">{value?.toString() || '-'}</div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Nút đóng */}
                    <div className="mt-6 text-right">
                        <button
                            onClick={onClose}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Đóng
                        </button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}
