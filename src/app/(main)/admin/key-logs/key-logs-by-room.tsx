"use client"
import UnderDevelopment from "@/components/core/under-development";
import { keyLogColumns, residentColumns } from "@/components/table/colums";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "react-use";
import { UserRes } from '@/types';
import { useQuery } from "@tanstack/react-query"
import CustomLoader from "@/components/loaders/custom-loader";
import { GET_RESIDENTS, GET_RESIDENTS_BY_ROOM } from "@/utils/server/resident";
import CustomError from "@/components/core/custom-error";
import { useState } from "react";
import { GET_ROOMS } from "@/utils/server/room";
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import Link from "next/link";
import { GET_KEY_LOG_BY_ROOM } from "@/utils/server/key-log";

export default function KeyLogsByRoom() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()!

    const roomId = searchParams.get('room')

    const [user, setUser] = useLocalStorage<UserRes | null>("user", null)


    const { isPending, isError, data, error, isSuccess } = useQuery({
        queryKey: ['filter-residents'],
        queryFn: async () => {
            if (user && user.token) {
                const porters = await GET_KEY_LOG_BY_ROOM(roomId || "", user.token)
                return porters
            }

        },
        retry: 3,
        staleTime: 300,
        refetchOnMount: true
    })

    if (isPending) {
        return (
            <section className="flex items-center justify-center w-full h-full">
                <CustomLoader />
            </section>

        )
    }

    return (
        <div className="h-full">
            <Link href={pathname}>
                <Button >
                    Clear Filter
                </Button>
            </Link>
            <>
                {
                    (isError || data === undefined) ? <CustomError /> :
                        <DataTable
                            filterableCol="sid"
                            columns={keyLogColumns}
                            data={data} title="key logs" />
                }
            </>
        </div>
    )
}