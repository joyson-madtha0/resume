"use client";
import React, { useEffect, useRef, useState } from "react";
import Parallax from "parallax-js";
import _ from "../_utils/lodash";
import classes from "../_utils/classNames";
import styles from "../_styles/404.module.css";

function generateDots(count: number) {
  let value = `${_.random(2000)}px ${_.random(2000)}px #fff`;
  for (let i = 2; i < count; i++) {
    value = `${value}, ${_.random(2000)}px ${_.random(2000)}px #fff`;
  }
  return value;
}

function createRandomStarStyles() {
  const small = generateDots(700);
  const medium = generateDots(200);
  const big = generateDots(100);

  return `
  .${styles.small} { box-shadow: ${small};} .${styles.small}:after { box-shadow: ${small};}
  .${styles.medium} { box-shadow: ${medium};} .${styles.medium}:after { box-shadow: ${medium};} 
  .${styles.big} { box-shadow: ${big};} .${styles.big}:after { box-shadow: ${big};} 
  `;
}

export default function NotFoundPage() {
  const scene = useRef(null);
  const [style, updateStyle] = useState("");
  useEffect(() => {
    new Parallax(scene.current);
    /* css calculation */
    const styles = createRandomStarStyles();
    updateStyle(styles);
  }, []);
  return (
    <>
      <style type="text/css" dangerouslySetInnerHTML={{ __html: style }} />
      <section className={styles.wrapper}>
        <div className={classes(styles.stars, styles.small)} />
        <div className={classes(styles.stars, styles.medium)} />
        <div className={classes(styles.stars, styles.large)} />
        <div className={styles.container}>
          <div ref={scene} className={styles.scene} data-hover-only="false">
            <div className={styles.circle} data-depth="1.2" />
            <div className={styles.one} data-depth="0.9">
              <div className={styles.content}>
                <span className={styles.piece} />
                <span className={styles.piece} />
                <span className={styles.piece} />
              </div>
            </div>
            <div className={styles.two} data-depth="0.60">
              <div className={styles.content}>
                <span className={styles.piece} />
                <span className={styles.piece} />
                <span className={styles.piece} />
              </div>
            </div>
            <div className={styles.three} data-depth="0.40">
              <div className={styles.content}>
                <span className={styles.piece} />
                <span className={styles.piece} />
                <span className={styles.piece} />
              </div>
            </div>
            <p className={styles.p404} data-depth="0.50">
              404
            </p>
            <p className={styles.p404} data-depth="0.10">
              404
            </p>
          </div>
          <div className={styles.text}>
            <article>
              <p>
                Uh oh! Looks like i lost you. <br /> Please go back to homepage
              </p>
              <button>OK, Cool</button>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
