declare type TableState = {
    tableData: {
        data: EmptyObjectType[];
        header: TableHeaderType[];
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