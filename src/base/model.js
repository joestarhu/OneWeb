// 样式模型
const dmSTYLE = {
    enable: "color:#25B25C;font-weight:800;",
    disable: "color:#DF184A;font-weight:800",
}

// 基础模型数据
const modelBase = {
    create_name: { label: "msgCreateName" },
    update_name: { label: "msgUpdateName" },
    created_at: { label: "msgCreateDt" },
    updated_at: { label: "msgUpdateDt" }
}

// 用户信息
const modelUser = {
    account: { label: "msgAccount" },
    nick_name: { label: "msgNickName" },
    phone: { label: "msgPhone" },
    status: { label: "msgStatus", options: [{ label: "启用", value: 1, style: dmSTYLE.enable }, { label: "停用", value: 0, style: dmSTYLE.disable },] },
}

// 组织信息
const modelOrg = {
    org_name: { label: "msgOrgName" },
    owner_name: { label: "msgOrgOwnerName" },
    remark: { label: "msgRemark" },
    status: { label: "msgStatus", options: [{ label: "启用", value: 1, style: dmSTYLE.enable }, { label: "停用", value: 0, style: dmSTYLE.disable },] },
}


export { modelBase, modelUser, modelOrg }