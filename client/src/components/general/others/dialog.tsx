import { Modal, Title, Text, Button, Alert, Group } from "@mantine/core";
import { AlertCircle } from "tabler-icons-react";
import React from "react";

type DialogBoxProps = {
    showDialog: boolean;
    cancelNavigation: any;
    confirmNavigation: any;
};

export default function NavDialog({
    showDialog,
    cancelNavigation,
    confirmNavigation,
}: DialogBoxProps) {
    return (
        <Modal
            opened={showDialog}
            onClose={cancelNavigation}
            padding={5}
            withCloseButton={false}
        >
            <Alert
                icon={<AlertCircle size={16} />}
                title="Warning!"
                color="red"
                mb={10}
            >
                There are some changes that haven't been saved, do you want to
                save them before you leave?
            </Alert>
            <Group position="right">
                <Button variant="subtle" onClick={cancelNavigation}>
                    Yes
                </Button>
                <Button
                    variant="subtle"
                    onClick={confirmNavigation}
                    color="red"
                >
                    No
                </Button>
            </Group>
        </Modal>
    );
}
