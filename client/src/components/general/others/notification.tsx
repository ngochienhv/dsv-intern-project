import React, { Dispatch, SetStateAction } from "react";
import { Modal, Alert } from "@mantine/core";
import { CircleCheck } from "tabler-icons-react";

type Props = {
    noti: boolean;
    setNoti: Dispatch<SetStateAction<boolean>>;
    notiStatus: string;
    notiMessage: string;
};

export default function Notifications({
    noti,
    setNoti,
    notiStatus,
    notiMessage,
}: Props) {
    React.useEffect(() => {
        console.log(notiStatus);
    }, [noti]);
    return (
        <Modal
            opened={noti}
            transition="fade"
            transitionDuration={400}
            transitionTimingFunction="ease"
            onClose={() => setNoti(false)}
            withCloseButton={false}
            padding={0}
        >
            <Alert
                icon={<CircleCheck size={16} />}
                withCloseButton={true}
                onClose={() => setNoti(false)}
                title={notiStatus + "!"}
                color={notiStatus === "success" ? "green" : "red"}
            >
                {notiMessage}
            </Alert>
        </Modal>
    );
}
