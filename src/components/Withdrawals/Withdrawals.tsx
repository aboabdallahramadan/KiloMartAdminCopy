"use client"
import React, { useEffect, useState } from 'react';
import { WithdrawRequest } from '@/types/withdrawRequest';

interface WithdrawalsProps {
    user: "Provider" | "Delivery"
}

const Withdrawals = ({ user }: WithdrawalsProps) => {
    const [withdrawals, setWithdrawals] = useState<Omit<WithdrawRequest, "name" | "phone" | "iban" | "userId">[]>([
        {
            id: 1,
            bankAccountNumber: "123456789",
            status: "Approved",
            date: new Date().toLocaleDateString()
        },
        {
            id: 2,
            bankAccountNumber: "987654321",
            status: "Rejected",
            date: new Date().toLocaleDateString()
        },
        {
            id: 3,
            bankAccountNumber: "555555555",
            status: "Pending",
            date: new Date().toLocaleDateString()
        }
    ]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize = 10;

    const fetchWithdrawals = async (page: number) => {
        const response = await fetch(`http://kilomart-001-site1.ptempurl.com/api/admin/withdrawals/paginated?provider=4&page=${page}&pageSize=${pageSize}&isActive=true`);
        const data = await response.json();
        if (data.status) {
            setWithdrawals(data.data.data);
            setTotalCount(data.data.totalCount);
        }
    };

    useEffect(() => {
        // fetchWithdrawals(currentPage);
    }, [currentPage]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div>
            <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
                <div className="px-4 py-6 md:px-6 xl:px-9">
                    <h4 className="text-body-2xlg font-bold text-dark dark:text-white">Withdrawals</h4>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-stroke px-4 py-4.5 dark:border-dark-3 sm:grid-cols-3 md:px-6 2xl:px-7.5">
                    <div className="col-span-1 hidden sm:flex items-center">
                        <p className="font-medium">Bank Account Number</p>
                    </div>
                    <div className="col-span-1 flex items-center">
                        <p className="font-medium">Date</p>
                    </div>
                    <div className="col-span-1 flex items-center justify-start">
                        <p className="font-medium">Status</p>
                    </div>
                </div>
                {withdrawals.map((withdrawal) => (
                    <div
                        className="grid grid-cols-2 gap-4 border-t border-stroke px-4 py-4.5 dark:border-dark-3 sm:grid-cols-3 md:px-6 2xl:px-7.5"
                        key={withdrawal.id}
                    >
                        <div className="col-span-1 hidden sm:flex items-center">
                            <p className="text-body-sm font-medium text-dark dark:text-dark-6">{withdrawal.bankAccountNumber}</p>
                        </div>
                        <div className="col-span-1 flex items-center">
                            <p className="text-body-sm font-medium text-dark dark:text-dark-6">{new Date(withdrawal.date).toLocaleDateString()}</p>
                        </div>
                        <div className="col-span-1 flex items-center">
                            <p
                                className={`inline-flex rounded-full px-3.5 py-1 text-body-sm font-medium ${
                                    withdrawal.status === "Approved"
                                        ? "bg-[#219653]/[0.08] text-[#219653]"
                                        : withdrawal.status === "Rejected"
                                            ? "bg-[#D34053]/[0.08] text-[#D34053]"
                                            : "bg-[#FFA70B]/[0.08] text-[#FFA70B]"
                                }`}
                            >
                                {withdrawal.status}
                            </p>
                        </div>
                    </div>
                ))}
                <div className="flex justify-between px-4 py-4">
                <button 
                    disabled={currentPage === 1} 
                    onClick={() => setCurrentPage(currentPage - 1)} 
                    className="bg-gray-300 hover:bg-gray-400 rounded px-4 py-2"
                >
                    Previous
                </button>
                <div className="flex justify-center space-x-2">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
                <button 
                    disabled={currentPage === totalPages} 
                    onClick={() => setCurrentPage(currentPage + 1)} 
                    className="bg-gray-300 hover:bg-gray-400 rounded px-4 py-2"
                >
                    Next
                </button>
            </div>
            </div>
            
            
        </div>
    );
};

export default Withdrawals;