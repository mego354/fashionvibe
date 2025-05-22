// @ts-ignore
import React from 'react';
// Placeholder for Table component
// @ts-ignore
export const Table = React.forwardRef<any, any>((props, ref) => <table ref={ref} {...props}>{props.children}</table>);
export const TableBody = React.forwardRef<any, any>((props, ref) => <tbody ref={ref} {...props}>{props.children}</tbody>);
export const TableCell = React.forwardRef<any, any>((props, ref) => <td ref={ref} {...props}>{props.children}</td>);
export const TableHead = React.forwardRef<any, any>((props, ref) => <th ref={ref} {...props}>{props.children}</th>);
export const TableHeader = React.forwardRef<any, any>((props, ref) => <thead ref={ref} {...props}>{props.children}</thead>);
export const TableRow = React.forwardRef<any, any>((props, ref) => <tr ref={ref} {...props}>{props.children}</tr>); 