local base_url = "http://localhost:8081/api"
local headers = {
    ["x-cc-token"] = "MY_CC_SECRET",
    ["Content-Type"] = "application/json"
}

local redstone_side = "right"
local machine_id = 17
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

local function fetchMachine()
    local ok, res = pcall(function()
        return http.get(base_url .. "/machines/" .. machine_id, headers)
    end)
    if not ok or not res then
        print("Failed to fetch machine")
        return nil
    end
    local body = ""
    local success, err = pcall(function() body = res.readAll() end)
    res.close()
    if not success then
        print("Failed to read machine response:", err)
        return nil
    end
    local ok, data = pcall(function() return textutils.unserializeJSON(body) end)
    if not ok then
        print("Failed to parse machine JSON")
        return nil
    end
    return data
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

local function updateMachine(status)
    local payload = encodeJSON({ is_enabled = status })
    local ok, body = safePost(base_url .. "/machines/" .. machine_id .. "/update", payload)
    if ok then
        print("Machine update response:", body)
    else
        print("Failed to send machine update:", body)
    end
end

local function insertHistory(status)
    local payload = encodeJSON({
        machine_id = machine_id,
        is_enabled = status
    })
    local ok, body = safePost(base_url .. "/machine-history", payload)
    if ok then
        print("Machine history response:", body)
    else
        print("Failed to send machine history:", body)
    end
end

while true do
    local machine = fetchMachine()
    if machine then
        local status = machine.is_enabled
        redstone.setOutput(redstone_side, status)
        updateMachine(status)
        insertHistory(status)
    else
        print("No machine data fetched")
    end
    os.sleep(sleep_seconds)
end