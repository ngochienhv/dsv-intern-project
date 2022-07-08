import React from "react";
import Profile from "../components/user/profile";

type Props = {
    other: boolean;
};

export default function ProfilePage({ other }: Props) {
    return <Profile other={other} />;
}
