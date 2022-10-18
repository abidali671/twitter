import React, { ReactElement, SVGProps } from "react";

interface Props {
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  title: String;
  onClick?: () => {};
  image?: HTMLImageElement | undefined;
}
const SidebarRow = ({ Icon, title, onClick,image }: Props) => {
  console.log('===',image);
  
  return (
    <div
      onClick={() => {
        onClick?.();
      }}
      className="flex items-start max-w-fit space-x-2 rounded-full px-2 py-2 transition-all duration-200 hover:bg-gray-100 cursor-pointer group "
    >
     <Icon className="w-6 h-6"/> 
      <p className="group-hover:text-twitter md:inline-flex hidden lg:text-lg">
        {title}
      </p>
    </div>
  );
};

export default SidebarRow;
