import React from "react";
import { Footer } from "@mantine/core";
import Logo from "../others/logo";

export default function Footers() {
    return (
        <Footer height={60} p="md" zIndex={99}>
            Copyright © by <Logo />
        </Footer>
    );
}
