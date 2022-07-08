import React from "react";
import { Skeleton } from "@mantine/core";

export default function Skeletons({ loading }: { loading: boolean }) {
    return (
        <>
            <Skeleton height={50} circle mb="xl" visible={loading} />
            <Skeleton height={8} radius="xl" visible={loading} />
            <Skeleton height={8} mt={6} radius="xl" visible={loading} />
            <Skeleton
                height={8}
                mt={6}
                width="70%"
                radius="xl"
                visible={loading}
            />
        </>
    );
}
