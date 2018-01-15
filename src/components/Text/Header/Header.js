import React from "react";

export const Header = props => {

    const style = {
        fontWeight: "bold",
        textTransform: "uppercase",
        fontFamily: "Arial",
        color: props.color || "#ffffff",
        fontSize: props.size,
        margin: props.margin || "0"
    }

    return (
        <h1 style={style}>{props.content}</h1>
    )
}