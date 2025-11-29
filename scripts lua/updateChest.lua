local base_url = "http://localhost:8081/api"
local headers = {
    ["x-cc-token"] = "MY_CC_SECRET",
    ["Content-Type"] = "application/json"
}

local chest_id = 6
local sleep_seconds = 15

local function encodeJSON(tbl)
    local json = "{"
    local first = true
    for k, v in pairs(tbl) do
        if not first then json = json .. "," end
        first = false
        json = json .. '"' .. k .. '":'
        if type(v) == "string" then
            json = json .. '"' .. v .. '"'
        elseif type(v) == "boolean" then
            json = json .. tostring(v)
        else
            json = json .. v
        end
    end
    json = json .. "}"
    return json
end

local function safePost(url, payload)
    local ok, res = pcall(function()
        return http.post(url, payload, headers)
    end)
    if not ok or not res then
        return false, "HTTP request failed"
    end
    local body = ""
    local success, err = pcall(function() body = res.readAll() end)
    res.close()
    if not success then
        return false, "Failed to read response: " .. err
    end
    return true, body
end

local function updateChest(total, item_name)
    local payload = encodeJSON({
        amount = total,
        item_name = item_name or ""
    })
    local ok, body = safePost(base_url .. "/chests/" .. chest_id .. "/update", payload)
    if ok then
        print("Chest update response:", body)
    else
        print("Failed to send chest update:", body)
    end
end

local function insertHistory(total)
    local payload = encodeJSON({
        chest_id = chest_id,
        amount = total
    })
    local ok, body = safePost(base_url .. "/chest-history", payload)
    if ok then
        print("Chest history response:", body)
    else
        print("Failed to send chest history:", body)
    end
end

while true do
    local chest = peripheral.find("minecraft:chest")
    if chest then
        local total = 0
        local item_name = nil
        for slot, item in pairs(chest.list()) do
            local name = item.name:match("^[^:]+:(.+)$") or item.name
            item_name = name
            total = total + item.count
        end
        updateChest(total, item_name)
        insertHistory(total)
    else
        print("No chest found")
    end
    os.sleep(sleep_seconds)
end