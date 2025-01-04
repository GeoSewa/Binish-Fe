/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect } from "react";

interface ITabOptions {
  id: number;
  label: string;
  value: number | string;
}

interface TabProps {
  tabOptions: ITabOptions[];
  className?: string;
  activeClassName?: string;
  onTabChange: (index: number | string) => void;
  activeTab?: number | string;
  clickable?: boolean;
  orientation: "row" | "column";
}

const Tab: React.FC<TabProps> = ({
  tabOptions,
  className,
  activeClassName,
  onTabChange,
  activeTab,
  clickable = false,
  orientation = "column",
}) => {
  const [activeTabx, setActiveTab] = useState(activeTab);

  useEffect(() => {
    setActiveTab(activeTab);
  }, [activeTab]);

  const handleTabClick = (index: number | string) => {
    if (!clickable) return;
    setActiveTab(index);
    onTabChange(index);
  };

  return (
    <div className={`${orientation === "column" ? "" : "naxatw-flex"}`}>
      {tabOptions.map((tab) => (
        <div
          key={tab.id}
          className={`${className} naxatw-cursor-pointer naxatw-text-gray-600a ${
            activeTabx === tab.value
              ? `${activeClassName} !naxatw-border-b-primary naxatw-border-b-2 naxatw-text-primary`
              : "hover:naxatw-text-primary"
          }`}
          onClick={() => handleTabClick(tab.value)}
        >
          <p className="naxatw-px-3 naxatw-py-2 naxatw-text-body-btn">
            {tab.label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Tab;
