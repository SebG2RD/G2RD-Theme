import React from "react";
import { useBlockProps } from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";

export default function Save({ attributes }) {
  const {
    title,
    endDate,
    showYears,
    showMonths,
    showDays,
    showHours,
    showMinutes,
    showSeconds,
    valueSize,
    labelSize,
    itemSpacing,
    itemPadding,
    itemBackground,
    itemBorderRadius,
    timerStyle,
    animation,
    animationSpeed,
  } = attributes;

  const blockProps = useBlockProps.save({
    className: "g2rd-countdown",
    style: {
      "--item-spacing": `${itemSpacing}px`,
      "--item-padding": `${itemPadding}px`,
      "--item-background": itemBackground,
      "--item-border-radius": `${itemBorderRadius}px`,
      "--value-size": `${valueSize}px`,
      "--label-size": `${labelSize}px`,
      "--animation-duration":
        animationSpeed === "slow"
          ? "2s"
          : animationSpeed === "fast"
          ? "0.5s"
          : "1s",
    },
  });

  const renderTimeUnit = (show, value, label) => {
    if (!show) return null;
    return (
      <div className={`countdown-item ${timerStyle} ${animation}`}>
        <div className="countdown-value">{value}</div>
        <div className="countdown-label">{label}</div>
      </div>
    );
  };

  return (
    <div {...blockProps} data-end-date={endDate}>
      {title && <h2 className="countdown-title">{title}</h2>}
      <div className="countdown-container">
        {renderTimeUnit(showYears, "00", "Years")}
        {renderTimeUnit(showMonths, "00", "Months")}
        {renderTimeUnit(showDays, "00", "Days")}
        {renderTimeUnit(showHours, "00", "Hours")}
        {renderTimeUnit(showMinutes, "00", "Minutes")}
        {renderTimeUnit(showSeconds, "00", "Seconds")}
      </div>
    </div>
  );
}
