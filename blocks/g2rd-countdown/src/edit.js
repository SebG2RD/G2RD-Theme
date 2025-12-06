import { __ } from "@wordpress/i18n";
import {
  useBlockProps,
  InspectorControls,
  PanelColorSettings,
} from "@wordpress/block-editor";
import {
  PanelBody,
  TextControl,
  DateTimePicker,
  ToggleControl,
  RangeControl,
  SelectControl,
} from "@wordpress/components";
import { useState, useEffect } from "@wordpress/element";
import { format } from "@wordpress/date";

export default function Edit({ attributes, setAttributes }) {
  const {
    endDate,
    title,
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
    layout,
  } = attributes;

  const blockProps = useBlockProps();
  const [timeLeft, setTimeLeft] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!endDate) return;

    const timer = setInterval(() => {
      const now = new Date();
      const end = new Date(endDate);
      const distance = end - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({
          years: 0,
          months: 0,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        return;
      }

      // Calculate years and months
      const years = end.getFullYear() - now.getFullYear();
      const months = end.getMonth() - now.getMonth();
      const totalMonths = years * 12 + months;

      setTimeLeft({
        years: Math.floor(totalMonths / 12),
        months: totalMonths % 12,
        days: Math.floor(distance / (1000 * 60 * 60 * 24)) % 30,
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  const renderTimeUnit = (label, value, show) => {
    if (!show) return null;
    return (
      <div
        className={`countdown-item ${timerStyle} ${animation}`}
        style={{
          minWidth: "80px",
          padding: itemPadding,
          margin: `0 ${itemSpacing}`,
          backgroundColor: itemBackground,
          borderRadius: itemBorderRadius,
          textAlign: "center",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          transition: "all 0.3s ease",
        }}
      >
        <div className="countdown-value" style={{ fontSize: valueSize }}>
          {value}
        </div>
        <div className="countdown-label" style={{ fontSize: labelSize }}>
          {label}
        </div>
      </div>
    );
  };

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Timer Settings", "g2rd-theme")}>
          <DateTimePicker
            currentDate={endDate}
            onChange={(date) => setAttributes({ endDate: format("c", date) })}
            is12Hour={true}
          />
          <TextControl
            label={__("Title", "g2rd-theme")}
            value={title}
            placeholder="Test modifiable"
            onChange={(value) => setAttributes({ title: value })}
            __next40pxDefaultSize={true}
          />
        </PanelBody>

        <PanelBody title={__("Display Units", "g2rd-theme")}>
          <ToggleControl
            label={__("Show Years", "g2rd-theme")}
            checked={showYears}
            onChange={() => setAttributes({ showYears: !showYears })}
          />
          <ToggleControl
            label={__("Show Months", "g2rd-theme")}
            checked={showMonths}
            onChange={() => setAttributes({ showMonths: !showMonths })}
          />
          <ToggleControl
            label={__("Show Days", "g2rd-theme")}
            checked={showDays}
            onChange={() => setAttributes({ showDays: !showDays })}
          />
          <ToggleControl
            label={__("Show Hours", "g2rd-theme")}
            checked={showHours}
            onChange={() => setAttributes({ showHours: !showHours })}
          />
          <ToggleControl
            label={__("Show Minutes", "g2rd-theme")}
            checked={showMinutes}
            onChange={() => setAttributes({ showMinutes: !showMinutes })}
          />
          <ToggleControl
            label={__("Show Seconds", "g2rd-theme")}
            checked={showSeconds}
            onChange={() => setAttributes({ showSeconds: !showSeconds })}
          />
        </PanelBody>

        <PanelBody title={__("Style Settings", "g2rd-theme")}>
          <SelectControl
            label={__("Layout", "g2rd-theme")}
            value={layout}
            options={[
              { label: __("Row (Horizontal)", "g2rd-theme"), value: "row" },
              { label: __("Column (Vertical)", "g2rd-theme"), value: "column" },
            ]}
            onChange={(value) => setAttributes({ layout: value })}
          />
          <SelectControl
            label={__("Timer Style", "g2rd-theme")}
            value={timerStyle}
            options={[
              { label: __("Default", "g2rd-theme"), value: "default" },
              { label: __("Digital", "g2rd-theme"), value: "digital" },
              { label: __("Neon", "g2rd-theme"), value: "neon" },
              { label: __("Retro", "g2rd-theme"), value: "retro" },
              { label: __("Minimal", "g2rd-theme"), value: "minimal" },
              { label: __("Bold", "g2rd-theme"), value: "bold" },
            ]}
            onChange={(value) => setAttributes({ timerStyle: value })}
          />
          <SelectControl
            label={__("Animation", "g2rd-theme")}
            value={animation}
            options={[
              { label: __("None", "g2rd-theme"), value: "none" },
              { label: __("Pulse", "g2rd-theme"), value: "pulse" },
              { label: __("Flip", "g2rd-theme"), value: "flip" },
              { label: __("Fade", "g2rd-theme"), value: "fade" },
              { label: __("Bounce", "g2rd-theme"), value: "bounce" },
            ]}
            onChange={(value) => setAttributes({ animation: value })}
          />
          <SelectControl
            label={__("Animation Speed", "g2rd-theme")}
            value={animationSpeed}
            options={[
              { label: __("Slow", "g2rd-theme"), value: "slow" },
              { label: __("Normal", "g2rd-theme"), value: "normal" },
              { label: __("Fast", "g2rd-theme"), value: "fast" },
            ]}
            onChange={(value) => setAttributes({ animationSpeed: value })}
          />
          <RangeControl
            label={__("Value Size", "g2rd-theme")}
            value={parseInt(valueSize)}
            onChange={(value) => setAttributes({ valueSize: `${value}em` })}
            min={1}
            max={5}
            step={0.1}
          />
          <RangeControl
            label={__("Label Size", "g2rd-theme")}
            value={parseInt(labelSize)}
            onChange={(value) => setAttributes({ labelSize: `${value}em` })}
            min={0.5}
            max={2}
            step={0.1}
          />
          <RangeControl
            label={__("Item Spacing", "g2rd-theme")}
            value={parseInt(itemSpacing)}
            onChange={(value) => setAttributes({ itemSpacing: `${value}px` })}
            min={0}
            max={50}
            step={1}
          />
          <RangeControl
            label={__("Item Padding", "g2rd-theme")}
            value={parseInt(itemPadding)}
            onChange={(value) => setAttributes({ itemPadding: `${value}px` })}
            min={5}
            max={50}
            step={1}
          />
          <RangeControl
            label={__("Border Radius", "g2rd-theme")}
            value={parseInt(itemBorderRadius)}
            onChange={(value) =>
              setAttributes({ itemBorderRadius: `${value}px` })
            }
            min={0}
            max={20}
          />
        </PanelBody>
      </InspectorControls>
      <div {...blockProps}>
        <h3>{title}</h3>
        <div
          className="g2rd-countdown"
          style={{
            display: "flex",
            flexDirection: layout === "column" ? "column" : "row",
            justifyContent: "center",
            flexWrap: layout === "column" ? "nowrap" : "wrap",
            gap: itemSpacing,
          }}
        >
          {renderTimeUnit(__("Years", "g2rd-theme"), "00", showYears)}
          {renderTimeUnit(__("Months", "g2rd-theme"), "00", showMonths)}
          {renderTimeUnit(__("Days", "g2rd-theme"), "00", showDays)}
          {renderTimeUnit(__("Hours", "g2rd-theme"), "00", showHours)}
          {renderTimeUnit(__("Minutes", "g2rd-theme"), "00", showMinutes)}
          {renderTimeUnit(__("Seconds", "g2rd-theme"), "00", showSeconds)}
        </div>
      </div>
    </>
  );
}
