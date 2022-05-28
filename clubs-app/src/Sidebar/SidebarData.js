import React, {useEffect} from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as RiIcons from "react-icons/ri";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const getGroups = async () => {
	
};

export const SidebarData = [
	{
		icon: <FontAwesomeIcon icon={faUsers} />,
		color: "#fff",
		title: "Grup 1"
	},

	{
		icon: <FontAwesomeIcon icon={faUsers} />,
		color: "#fff",
		title: "Grup 2"
	}
];
