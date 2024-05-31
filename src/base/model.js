// 数据模型
const dmSTYLE = {
    enable: "color:#25B25C;font-weight:800;",
    disable: "color:#DF184A;font-weight:800",
}

// 基础模型
const modelBase = {
    create_name: { label: "msgCreateName" },
    update_name: { label: "msgUpdateName" },
    create_dt: { label: "msgCreateDt" },
    update_dt: { label: "msgUpdateDt" },
}

// 账户相关模型
const modelUser = {
    account: { label: "msgAccount" },
    nick_name: { label: "msgNickName" },
    phone: { label: "msgPhone" },
    status: { label: "msgStatus", options: [{ label: "启用", value: 1, style: dmSTYLE.enable }, { label: "停用", value: 0, style: dmSTYLE.disable },] },
}


export { modelBase, modelUser }