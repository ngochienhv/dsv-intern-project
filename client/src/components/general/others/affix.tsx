import React, { MouseEventHandler } from "react";
import { Affix, Button, Transition, useMantineTheme } from "@mantine/core";

type Props = {
    name: string;
    func: MouseEventHandler<HTMLButtonElement>;
    mounted: boolean;
    bottom: number;
    right: number;
};

export default function AffixBtn({
    name,
    func,
    mounted,
    bottom,
    right,
}: Props) {
    const theme = useMantineTheme();

    return (
        <>
            <Affix position={{ bottom: bottom, right: right }}>
                <Transition transition="slide-up" mounted={mounted}>
                    {(transitionStyles) => (
                        <Button
                            style={transitionStyles}
                            onClick={func}
                            sx={() => ({
                                backgroundColor:
                                    theme.colorScheme === "dark"
                                        ? theme.colors.blue[8]
                                        : theme.colors.dark[9],
                                transition: "background-color 0.3s",
                                "&:hover": {
                                    backgroundColor:
                                        theme.colorScheme === "dark"
                                            ? theme.colors.blue[4]
                                            : theme.colors.dark[5],
                                },
                            })}
                        >
                            {name}
                        </Button>
                    )}
                </Transition>
            </Affix>
        </>
    );
}
