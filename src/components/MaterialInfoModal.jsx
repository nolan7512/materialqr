'use client';

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';

export default function MaterialInfoModal({ isOpen, onClose, data }) {
    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
                {/* Overlay */}
                <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true" />

                {/* ❌ Nút X */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-[var(--button-bg)] text-[var(--button-text)] w-10 h-10 rounded-md flex items-center justify-center hover:bg-[var(--button-hover-bg)] z-10"
                >
                    X
                </button>

                <DialogPanel className="relative rounded-lg max-h-[80vh] w-full max-w-5xl overflow-y-auto p-6 shadow-xl bg-[var(--background)] text-[var(--font-color)]">
                    <DialogTitle className="flex text-3xl font-bold mb-4 items-center justify-center text-[var(--accent-color)]">
                        Material Information
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
                        {data ? (
                            Object.entries(data).map(([key, value]) => {
                                if (key === 'Image_URL') return null;
                                return (
                                    <div key={key} className="grid grid-cols-2 gap-4 border-b border-[var(--border-color)] py-1 text-sm">
                                        <div className="font-bold break-words text-[var(--label-color)]">{key}</div>
                                        <div className="break-words text-[var(--font-color)]">{value?.toString() || '-'}</div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-center text-gray-500">No data to display</p>
                        )}
                    </div>

                    {/* Nút đóng */}
                    <div className="mt-6 text-right">
                        <button
                            onClick={onClose}
                            className="bg-[var(--button-bg)] text-[var(--button-text)] px-4 py-2 rounded hover:bg-[var(--button-hover-bg)]"
                        >
                            Close
                        </button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}
