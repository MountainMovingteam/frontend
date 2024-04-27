// declare type TableState = {
//     tableData: {
//
//         data: EmptyObjectType[];
//
//         header: TableHeaderType[];
//
//         config: {
//
//             total: number;
//
//             loading: boolean;
//
//             isBorder: boolean;
//
//             isSelection: boolean;
//
//             isSerialNo: boolean;
//
//             isOperate: boolean;
//
//         };
//
//     };
// }
// 首先定义单元格数据的类型
type CellDataType = {
    text: string; // 假设text是字符串类型
    color: string; // 假设color是表示颜色的字符串，比如"#FF0000"代表红色
    // 可以添加更多属性，比如字体大小、对齐方式等
    // fontSize?: number;
    // align?: 'left' | 'right' | 'center';
};

// 然后更新TableState类型中的tableData.data属性
type TableState = {
    tableData: {
        data: CellDataType[]; // 使用新定义的CellDataType作为数组元素类型
        header: TableHeaderType[]; // 假设TableHeaderType已经定义
        config: {
            total: number;
            loading: boolean;
            isBorder: boolean;
            isSelection: boolean;
            isSerialNo: boolean;
            isOperate: boolean;
        };
    };
};