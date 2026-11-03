"use client";

import { useState, useEffect } from "react";

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  formattedEndDate: string;
  endDateObj: Date | null;
  mounted: boolean;
}

const SALE_DURATION_DAYS = 30;
const STORAGE_KEY = "wf_sale_end_timestamp_v1";

export function useSaleCountdown(): CountdownTime {
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({
    days: 30,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
    formattedEndDate: "December 4, 2026",
    endDateObj: null,
    mounted: false,
  });

  useEffect(() => {
    // 1. Determine or persist the 30-day target timestamp
    let endTimestamp: number;
    const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;

    if (stored) {
      endTimestamp = parseInt(stored, 10);
      // If corrupted or in the past by too much, re-initialize
      if (isNaN(endTimestamp) || endTimestamp < Date.now()) {
        endTimestamp = Date.now() + SALE_DURATION_DAYS * 24 * 60 * 60 * 1000;
        try {
          localStorage.setItem(STORAGE_KEY, endTimestamp.toString());
        } catch {
          // ignore
        }
      }
    } else {
      endTimestamp = Date.now() + SALE_DURATION_DAYS * 24 * 60 * 60 * 1000;
      try {
        localStorage.setItem(STORAGE_KEY, endTimestamp.toString());
      } catch {
        // ignore
      }
    }

    const endDate = new Date(endTimestamp);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    const formatted = endDate.toLocaleDateString("en-US", options);

    const updateCountdown = () => {
      const now = Date.now();
      const distance = endTimestamp - now;

      if (distance <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
          formattedEndDate: formatted,
          endDateObj: endDate,
          mounted: true,
        });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isExpired: false,
        formattedEndDate: formatted,
        endDateObj: endDate,
        mounted: true,
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return timeLeft;
}
