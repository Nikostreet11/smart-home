/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

$(document).ready(function() {
//$(document).bind("pageinit", function() { // shoots events twice
	app.initialize();
});

var app = {
	//availableDevices: [],
	connectedDevices: [],
	//connectedDevice: undefined,
	//activeUser: undefined,
	currentProfile: undefined,
	currentRoom: undefined,
	currentItem: undefined,
	currentSmartset: undefined,
	selectedPorts: [],
	extraPorts: [],
	editProfilesMode: false,
	editRoomsMode: false,
	editItemsMode: false,
	profileAvatarsPath: 'img/profiles/',
	defaultProfileAvatar: 'avatar-0',
	profileAvatars: ["avatar-0", "avatar-1", "avatar-2", "avatar-3", "avatar-4",
		"avatar-5", "avatar-6", "avatar-7", "avatar-8", "avatar-9", "avatar-10",
		"avatar-11",],
	roomIconsPath: 'img/rooms/',
	defaultRoomIcon: '017-furniture',
	roomIcons: ["001-bath", "002-bed", "003-bench", "004-bedside-table",
		"005-book-shelf", "006-book-shelf-1", "007-cabinet", "008-cradle",
		"009-chair", "010-chair-1", "011-chair-2", "012-closet",
		"013-coffee-table", "014-desk", "015-desktop", "016-picture",
		"017-furniture", "018-living-room", "019-hanger", "020-kitchen-set",
		"021-kitchen", "022-kitchen-table", "023-kitchen-1",
		"024-kitchen-table-1", "025-lamp", "026-nightstand", "027-nightstand-1",
		"028-office-chair", "029-rocking-chair", "030-shelf", "031-sofa",
		"032-chair-3", "033-stool", "034-television", "035-bunk", "036-sink",],
	itemIconsPath: 'img/items/',
	defaultItemIcon: '011-light-bulb',
	itemIcons: ["001-wifi", "002-thermometer", "003-refrigerator", "004-lamp",
		"005-washing-machine", "006-real-estate", "007-eco-house", "008-smart-home",
		"009-danger", "010-home", "011-light-bulb", "012-smartphone",
		"013-home-1", "014-setting", "015-house", "016-air-conditioner",
		"017-plant", "018-cup", "019-smart-home-1", "020-garage",
		"021-firefighting", "022-temperature-control", "023-security-camera",
		"024-wifi-1", "025-locker", "026-smart-home-2", "027-smart-key",
		"028-faucet", "029-music", "030-telephone", "031-password",
		"032-speakers", "033-fireplace", "034-smart-home-3", "035-dimmer", "036-plug",
		"037-plug-1", "038-heater",
		"039-smart-home-4", "040-weather", "041-degree", "042-temperature",
		"043-scales", "044-modem", "045-smart-lock", "046-recycle-bin",
		"047-light-bulb-1", "048-water", "049-house-1", "050-vision",],
	// DEBUG
	debugHost: 55,
	//--------------------

	
	initialize: function() {
		
/********** WELCOME ***********************************************************/
		
		$('#welcome-page').on("click", ".get-started-btn", function() {
			app.changePage("#sign-in-page");
		});
		
		
/********** SIGN IN ***********************************************************/
		
		$('#sign-in-page').on('pagehide', function() {
		});
		
		$('#sign-in-page').on('pagebeforeshow', function() {
			app.connectedDevices = [];
		});
		
		$("#sign-in-page").on('click', ".back-btn", function() {
			app.changePage("#welcome-page");
		});
		
		$("#sign-in-page").on('click', ".confirm-btn", async function() {
			// TODO: clear app.connectedDevices!
			let ipAddresses = [];
			$('#sign-in-page .ip-address').each(function() {
				let ipAddress =
						$(this).find('.ip-address-a').val() + '.' +
						$(this).find('.ip-address-b').val() + '.' +
						$(this).find('.ip-address-c').val() + '.' +
						$(this).find('.ip-address-d').val();
				ipAddresses.push(ipAddress);
			});
			
			if (ipAddresses.length != 0) {
				let requests = [];
				let results = [];
				let devices = [];
				for (let ipAddress of ipAddresses) {
					requests.push(app.arduino.getDeviceInfo(ipAddress));
				}
				try {
					results = await Promise.all(requests);
				}
				catch (error) {
					console.error('getDeviceInfo::error');
					alert('invalid input');
					return;
				}

				for (let result of results) {
					let response;
					try {
						response = JSON.parse(result);
					}
					catch (error) {
						console.error('JSON::parse::error');
						alert('invalid input');
						return;
					}
					if (response.outcome == 'success') {
						devices.push({
							ip_address: response.device_info.ip_address,
							name: response.device_info.name,
						});
					}
					else {
						alert('invalid input');
						return;
					}
				}
				app.connectedDevices = devices;
				app.changePage('#profiles-page');
			}
			else {
				alert('please add a device ip');
			}
		});
		
		/*$("#sign-in-page").on('click', ".refresh-btn", function() {
			app.refreshDevices();
			//app.refresh('#sign-in-page .devices');
		});*/
		
		$("#sign-in-page").on('focus', ".device input", function() {
			$(this).select();
		});
		
		$("#sign-in-page").on('input', ".device input", async function() {
			if ($(this).val() > 25) {
				let $next = $(this).closest('.ui-input-text').next().find('input');
				if ($next != undefined) {
					//alert($next.attr('class'));
					$next.focus();
				}
			}
			let $device = $(this).closest('.device');
			let $checkLabel = $device.find('.check-label');
			let $alertLabel = $device.find('.alert-label');
			//$device.find('.name').text('');
			$device.removeClass('device-ready');
			$device.removeClass('device-unavailable');
			$checkLabel.addClass('hidden');
			$alertLabel.addClass('hidden');
			let $ipAddressContainer = $(this).closest('.ip-address');
			let $ipAddressA = $ipAddressContainer.find('.ip-address-a');
			let $ipAddressB = $ipAddressContainer.find('.ip-address-b');
			let $ipAddressC = $ipAddressContainer.find('.ip-address-c');
			let $ipAddressD = $ipAddressContainer.find('.ip-address-d');
			if ($ipAddressA.val() != '' && $ipAddressB.val() != '' &&
					$ipAddressC.val() != '' && $ipAddressD.val() != '') {
				let ipAddress =
						$ipAddressA.val() + '.' + $ipAddressB.val() + '.' +
						$ipAddressC.val() + '.' + $ipAddressD.val();
				try {
					let response = JSON.parse(await app.arduino.getDeviceInfo(ipAddress));
					if (response.outcome == 'success') {
						//$device.find('.name').text(response.device_info.name);
						$device.removeClass('device-unavailable');
						$device.addClass('device-ready');
						$checkLabel.removeClass('hidden');
						$alertLabel.addClass('hidden');
					}
				}
				catch (error) {
					if (ipAddress == $ipAddressA.val() + '.' + $ipAddressB.val() + '.' +
							$ipAddressC.val() + '.' + $ipAddressD.val()) {
						console.error('getDeviceInfo::error');
						$device.removeClass('device-ready');
						$device.addClass('device-unavailable');
						$checkLabel.addClass('hidden');
						$alertLabel.removeClass('hidden');
					}
				}
			}
		});
		
		$("#sign-in-page").on('click', ".remove-btn", function() {
			$(this).parents('.device').remove();
			$('#sign-in-page .devices').listview('refresh');
		});
		
		$("#sign-in-page").on('click', ".add-btn", function() {
			app.addElement('#sign-in-page .devices');
		});
		
		/*$("#sign-in-page").on('click', ".check-btn", async function() {
			let ipAddressContainer = $(this).siblings('.ip-address');
			let ipAddress =
					ipAddressContainer.find('.ip-address-a').val() + '.' +
					ipAddressContainer.find('.ip-address-b').val() + '.' +
					ipAddressContainer.find('.ip-address-c').val() + '.' +
					ipAddressContainer.find('.ip-address-d').val();
			try {
				let response = JSON.parse(await app.arduino.getDeviceInfo(ipAddress));
				if (response.outcome == 'success') {
					$(this).siblings('.name').text(response.device_info.name);
					$(this).parents('.device').addClass('device-ready');
				}
			}
			catch (error) {
				console.error('getDeviceInfo::error');
				$(this).siblings('.name').text('');
				$(this).parents('.device').addClass('device-unavailable');
			}
		});*/
		
		/*$("#sign-in-page").on('change', ".ip-address input", function() {
			$(this).parents('.device').removeClass('device-ready');
			$(this).parents('.device').removeClass('device-unavailable');
			$(this).parents('.device').find('.name').text('');
		});*/
		
		/*$("#sign-in-page .submit-btn").click(function() {
			var device = $("#sign-in-page input[name=\"available-devices\"]:checked");
			
			app.connectedDevice = {
				"device-name" : device.attr("device-name"),
				"address" : device.attr("address"),
			};
			
			app.changePage("#profiles-page");
		});*/
		
		
/********** REGISTER **********************************************************/
		
		/*
		$("#registerPage .submitBtn").click(function() {
			if (app.connectedDevice != undefined) {
				var name = $("#registerPage input[name='name']").val();
				var password = $("#registerPage input[name='password']").val();
				if (password == 
						$("#registerPage input[name='passwordCheck']").val()) {
					if(app.arduino.registerUser(name, password)) {
						app.activeUser = name;
						alert("Hi " + app.activeUser + "!");
						app.changePage("#profilesPage");
					}
					else {
						alert("Error: registration failed");
					}
				}
				else {
					alert("Error: passwords not matching");
				}
			}
			else
				alert("Error: device not found");
		});
		*/
		
		
/********** PROFILES **********************************************************/
		
		$('#profiles-page').on('pagehide', function() {
		});
		
		$('#profiles-page').on('pagebeforeshow', function() {
			app.currentRoom = undefined;
			app.setEditProfilesMode(false);
			app.refresh('#profiles-page .profiles');
		});
		
		$("#profiles-page .back-btn").click(function() {
			app.activeUser = undefined;
			app.changePage("#welcome-page");
		});
		
		$("#profiles-page .edit-btn").click(function() {
			if (app.editProfilesMode) {
				app.setEditProfilesMode(false);
			}
			else {
				app.setEditProfilesMode(true);
			}
		});
		
		$("#profiles-page .add-btn").click(function() {
			app.changePage("#add-profile-page");
		});
		
		// must use "on" because .profile is dynamically generated
		$("#profiles-page").on("click", ".profile-btn", function() {
			app.arduino.coopGetProfile($(this).children(".profile").attr("id"))
			.then(function(result) {
				var response = result;

				if (response.outcome == "success") {
					app.currentProfile = response.profile;

					if (app.editProfilesMode) {
						$.mobile.navigate('#edit-profile-page');
					}
					else {
						app.changePage("#control-panel-page");
					}
				}
				else {
					alert(response.error);
				}
			})
			.catch(function() {
				alert("getProfile::error");
			});
		});
		
		
/********** EDIT PROFILE ******************************************************/
		
		$("#edit-profile-page").on("pagehide", function() {
			app.currentProfile = undefined;
		});
		
		$("#edit-profile-page").on("pagebeforeshow", function() {
			$('#edit-profile-page .profile-avatar').attr('name',
					app.currentProfile.avatar);
			$('#edit-profile-page .profile-avatar').attr('src',
					'img/profiles/' + app.currentProfile.avatar + '.png');
			$('#edit-profile-page .profile-name').val(app.prettyfy(app.currentProfile.name));
			app.load('#edit-profile-page .avatars', app.profileAvatars);
		});
		
		$("#edit-profile-page .back-btn").click(async function() {
			await app.changePage("#profiles-page");
			app.onLeave('#edit-profile-page');
		});
		
		$("#edit-profile-page .confirm-btn").click(async function() {
			var newProfile = {
				name : app.dePrettyfy($("#edit-profile-page .profile-name").val()),
				avatar : $("#edit-profile-page .profile-avatar").attr('name'),
			};
			
			if (newProfile.name != "" &&
					!newProfile.name.includes(" ") &&
					newProfile.avatar != "") {
				app.arduino.coopEditProfile(app.currentProfile, newProfile)
				.then(async function(response) {
					if (response.outcome == "success") {
						//alert("Profile saved successfully");

						await app.changePage("#profiles-page");
						app.onLeave('#edit-profile-page');
					}
					else {
						alert(response.error);
					}
				})
				.catch(function() {
					alert("editProfile::error");
				});
			}
			else {
				alert("invalid data");
			}
		});
		
		$('#edit-profile-page').on("click", ".avatar-btn", function() {
			$('#edit-profile-page .profile-avatar').attr(
					'name',
					$(this).find('.avatar').attr('name'));
			$('#edit-profile-page .profile-avatar').attr(
					'src',
					$(this).find('img').attr('src'));
		});
		
		$("#edit-profile-page .remove-btn").click(async function() {
			app.arduino.coopRemoveProfile(app.currentProfile)
			.then(async function(response) {
				if (response.outcome == "success") {
					app.currentProfile = undefined;
					await app.changePage("#profiles-page");
					app.onLeave('#edit-profile-page');
				}
				else {
					alert(response.error);
				}
			})
			.catch(function() {
				alert("removeProfile::error");
			});
		});

		
/********** ADD PROFILE *******************************************************/
		
		$("#add-profile-page").on("pagehide", function() {
		});
		
		$("#add-profile-page").on("pagebeforeshow", function() {
			$('#add-profile-page .profile-avatar').attr('name',
					app.defaultProfileAvatar);
			$('#add-profile-page .profile-avatar').attr('src',
					app.profileAvatarsPath + app.defaultProfileAvatar + '.png');
			$('#add-profile-page .profile-name').val('');
			app.load('#add-profile-page .avatars', app.profileAvatars);
		});
		
		$("#add-profile-page .back-btn").click(async function() {
			await app.changePage("#profiles-page");
			app.onLeave('#add-profile-page');
		});
		
		$("#add-profile-page .confirm-btn").click(async function() {
			var profile = {
				name : app.dePrettyfy($("#add-profile-page .profile-name").val()),
				avatar : $("#add-profile-page .profile-avatar").attr('name'),
			};
			
			if (profile.name != "" &&
					!profile.name.includes(" ") &&
					profile.avatar != "") {
				app.arduino.coopAddProfile(profile)
				.then(async function(response) {
					if (response.outcome == "success") {
						await app.changePage("#profiles-page");
						app.onLeave('#add-profile-page');
					}
					else {
						alert(response.error);
					}
				})
				.catch(function() {
					alert("addProfile::error");
				});
			}
			else {
				alert("invalid data");
			}
		});
		
		$('#add-profile-page').on("click", ".avatar-btn", function() {
			$('#add-profile-page .profile-avatar').attr(
					'name',
					$(this).find('.avatar').attr('name'));
			$('#add-profile-page .profile-avatar').attr(
					'src',
					$(this).find('img').attr('src'));
		});
		
		
/********** SIGN IN PROFILE ***************************************************/
		
		
		
		/*
		$("#signInProfilePage .backBtn").click(function() {
			app.currentProfile = undefined;
			app.changePage("#profilesPage");
		});
		
		$("#signInProfilePage .submitBtn").click(function() {
			var password = $("#signInProfilePage input[name='password']").val();
			if (app.arduino.signInProfile(app.currentProfile, password)) {
				alert("Sign in successfully!");
				app.changePage("#controlPanelPage");
			}
			else
				alert("Error: login failed");
		});
		*/
		
		
/********** CONTROL PANEL *****************************************************/
		
		$('#control-panel-page').on('pagehide', function() {
		});
		
		$('#control-panel-page').on('pagebeforeshow', function() {
			app.currentItem = undefined;
			app.setEditRoomsMode(false);
			app.refresh('#control-panel-page .rooms');
			app.close('#control-panel-page .footer', 0);
		});
		
		$("#control-panel-page .menu-btn").click(function() {
			//TODO: replace these operation with: open side menu
			app.currentProfile = undefined;
			app.changePage("#profiles-page");
		});
		
		$("#control-panel-page .edit-btn").click(function() {
			if (app.editRoomsMode)
				app.setEditRoomsMode(false);
			else
				app.setEditRoomsMode(true);
		});
		
		$("#control-panel-page .add-btn").click(function() {
			app.changePage("#add-room-page");
		});
		
		$("#control-panel-page")
		.on("click", ".room-smart-btn", async function() {
			let roomId = $(this).parents('.room').attr("room-id");
			let profileId = app.currentProfile.id;
			let deviceIp = $(this).parents('.room').attr("device-ip"); 
			try {
				let response1 = JSON.parse(await app.arduino.getRoom(
						roomId,
						profileId,
						deviceIp));

				if (response1.outcome == "success") {
					app.currentRoom = response1.room;

					if (app.editRoomsMode) {
						app.changePage("#edit-room-page");
					}
					else {
						try {
							let response = JSON.parse(
									await app.arduino.getActiveSmartsets(
											roomId,
											deviceIp));
							if (response.outcome != "success") {
								alert(response.error);
								return;
							}
							let activeSmartset = app.findSmartset(
									profileId,
									response.active_smartsets);

							if (activeSmartset == undefined) {
								if (app.isOpen('#control-panel-page .footer')) {
									await app.close('#control-panel-page .footer');
								}
								await app.refresh("#control-panel-page .footer .smartsets");
								app.open('#control-panel-page .footer');
							}
							else {
								try {
									let response2 = JSON.parse(await app.arduino.deactivateSmartset(
											activeSmartset.id,
											roomId,
											profileId,
											deviceIp));

									if (response2.outcome == "success") {
										app.refresh('#control-panel-page .rooms');
									}
									else {
										alert(response2.error);
									}
								}
								catch (error) {
									alert("deactivateSmartset::error");
								}
							}
						}
						catch (error) {
							alert("getActiveSmartsets::error");
						}
					}
				}
				else {
					alert(response1.error);
				}
			}
			catch (error) {
				alert("getRoom::error");
			}
		});
		
		$("#control-panel-page")
		.on("click", ".room-manual-btn", function() {
			let roomId = $(this).parents('.room').attr("room-id");
			let deviceIp = $(this).parents('.room').attr("device-ip");
			app.arduino.getRoom(
					roomId,
					app.currentProfile.id,
					deviceIp)
			.then(function(result) {
				var response = JSON.parse(result);

				if (response.outcome == "success") {
					app.currentRoom = response.room;
					app.changePage("#manual-panel-page");
				}
				else {
					alert(response.error);
				}
			})
			.catch(function() {
				alert("getRoom::error");
			});
		});
		
		$("#control-panel-page .footer")
		.on("click", ".close-footer-btn", function() {
			app.close('#control-panel-page .footer');
		});
		
		$("#control-panel-page .footer")
		.on("click", ".smartset-btn", async function() {
			let smartsetId = $(this).parent().attr('smartset-id');
			
			try {
				let response = JSON.parse(await app.arduino.activateSmartset(
						smartsetId,
						app.currentRoom,
						app.currentProfile,
						app.currentRoom.device.ip_address));

				if (response.outcome == "success") {
					app.close('#control-panel-page .footer');
					//app.refreshRooms();
					app.refresh('#control-panel-page .rooms');
				}
				else if (response.outcome == "partial_success") {
					alert(response.reason);
					app.close('#control-panel-page .footer');
					//app.refreshRooms();
					app.refresh('#control-panel-page .rooms');
				}
				else {
					alert(response.error);
				}
			}
			catch (e) {
				alert("activateSmartset::error");
			}
		});
		
		
/********** EDIT ROOM *********************************************************/
		
		$('#edit-room-page').on('pagehide', function() {
			app.currentRoom = undefined;
		});
		
		$('#edit-room-page').on('pagebeforeshow', function() {
			$('#edit-room-page .room-icon').attr('name',
					app.currentRoom.icon);
			$('#edit-room-page .room-icon').attr('src',
					app.roomIconsPath + app.currentRoom.icon + '.png');
			$('#edit-room-page .room-name').val(app.prettyfy(app.currentRoom.name));
			app.load('#edit-room-page .icons', app.roomIcons);
		});
		
		$("#edit-room-page .back-btn").click(async function() {
			await app.changePage("#control-panel-page");
			app.onLeave('#edit-room-page');
		});
		
		$("#edit-room-page .confirm-btn").click(async function() {
			var newRoom = {
				name : app.dePrettyfy($("#edit-room-page .room-name").val()),
				icon : $("#edit-room-page .room-icon").attr('name'),
			};
			
			if (newRoom.name != "" &&
					!newRoom.name.includes(" ") &&
					newRoom.icon != undefined) {
				app.arduino.editRoom(
						app.currentRoom,
						newRoom,
						app.currentRoom.device.ip_address)
				.then(async function(response) {
					var outcome = JSON.parse(response).outcome;

					if (outcome == "success") {
						//alert("Room saved successfully");

						await app.changePage("#control-panel-page");
						app.onLeave('#edit-room-page');
					}
					else {
						alert(JSON.parse(response).error);
					}
				})
				.catch(function() {
					alert("editRoom::error");
				});
			}
			else {
				alert("invalid data");
			}
		});
		
		$('#edit-room-page').on("click", ".icon-btn", function() {
			$('#edit-room-page .room-icon').attr(
					'name',
					$(this).find('.icon').attr('name'));
			$('#edit-room-page .room-icon').attr(
					'src',
					$(this).find('img').attr('src'));
		});
		
		$("#edit-room-page .remove-btn").click(async function() {
			app.arduino.removeRoom(
					app.currentRoom,
					app.currentRoom.device.ip_address)
			.then(async function(response) {
				var outcome = JSON.parse(response).outcome;

				if (outcome == "success") {
					await app.changePage("#control-panel-page");
					app.onLeave('#edit-room-page');
				}
				else {
					alert(JSON.parse(response).error);
				}
			})
			.catch(function() {
				alert("removeRoom::error");
			});
		});

/********** ADD ROOM **********************************************************/
		
		$('#add-room-page').on('pagehide', function() {
			app.close('#add-room-page .devices-collapsible');
		});
		
		$('#add-room-page').on('pagebeforeshow', function() {
			$('#add-room-page .room-icon').attr('name',
					app.defaultRoomIcon);
			$('#add-room-page .room-icon').attr('src',
					app.roomIconsPath + app.defaultRoomIcon + '.png');
			$('#add-room-page .room-name').val('');
			app.load('#add-room-page .devices', app.connectedDevices);
			app.load('#add-room-page .icons', app.roomIcons);
		});
		
		$("#add-room-page .back-btn").click(async function() {
			await app.changePage("#control-panel-page");
			app.onLeave('#add-room-page');
		});
		
		$("#add-room-page .confirm-btn").click(async function() {
			let room = {
				name : app.dePrettyfy($("#add-room-page .room-name").val()),
				icon : $("#add-room-page .room-icon").attr('name'),
			};
			let deviceIp = $('#add-room-page .devices .title').attr('device-ip');
			
			if (room.name != "" &&
					!room.name.includes(" ") &&
					room.icon != undefined) {
				app.arduino.addRoom(
						room,
						deviceIp)
				.then(async function(response) {
					var outcome = JSON.parse(response).outcome;

					if (outcome == "success") {
						await app.changePage("#control-panel-page");
						app.onLeave('#add-room-page');
					}
					else {
						alert(JSON.parse(response).error);
					}
				})
				.catch(function() {
					alert("addRoom::error");
				});
			}
			else {
				alert("invalid data");
			}
		});
		
		$("#add-room-page")
		.on("click", ".device-btn", function() {
			let title = $('#add-room-page .devices .title-inner');
			title.html($(this).find('.device-name').html());
			title.parents('.title').attr(
					'device-ip',
					$(this).parents('.device').attr('device-ip'));
			title.parents('.devices-collapsible').collapsible('collapse');
		});
		
		$('#add-room-page').on("click", ".icon-btn", function() {
			$('#add-room-page .room-icon').attr(
					'name',
					$(this).find('.icon').attr('name'));
			$('#add-room-page .room-icon').attr(
					'src',
					$(this).find('img').attr('src'));
		});
		
		
/********** MANUAL PANEL ******************************************************/
		
		$('#manual-panel-page').on('pagehide', function() {
			app.close('#manual-panel-page .smartsets-collapsible', 0);
			app.close('#manual-panel-page .smartsets-panel', 0);
		});
		
		$('#manual-panel-page').on('pagebeforeshow', function() {
			app.setEditItemsMode(false);
			app.refresh('#manual-panel-page .ui-content .smartsets');
			app.refresh('#manual-panel-page .items');
		});
		
		$("#manual-panel-page .back-btn").click(function() {
			app.currentRoom = undefined;
			app.changePage("#control-panel-page");
		});
		
		$("#manual-panel-page .edit-btn").click(function() {
			if (app.editItemsMode) {
				app.setEditItemsMode(false);
			}
			else {
				app.setEditItemsMode(true);
			}
		});
		
		$(document).on("pagecreate", "#manual-panel-page", function() {
			$("#manual-panel-page")
			.on("click", ".ui-content .smartset-btn", async function() {
				let smartsetId = $(this).parent().attr('smartset-id');
				try {
					let response = JSON.parse(await app.arduino.getSmartset(
							smartsetId,
							app.currentProfile,
							app.currentRoom,
							app.currentRoom.device.ip_address));
					if (response.outcome == "success") {
						app.currentSmartset = response.smartset;
						app.open('#manual-panel-page .smartset-popup');
					}
					else {
						alert(response.error);
					}
				}
				catch(error) {
					alert("getSmartset::error");
				}
			});
		});
		
		$(document).on("pagecreate", "#manual-panel-page", function() {
			$("#manual-panel-page")
			.on("click", ".ui-content .edit-smartset-btn", async function() {
				let smartsetId = $(this).parent().attr('smartset-id');
				try {
					let response = JSON.parse(await app.arduino.getSmartset(
							smartsetId,
							app.currentProfile,
							app.currentRoom,
							app.currentRoom.device.ip_address));
					if (response.outcome == "success") {
						app.currentSmartset = response.smartset;
						app.open("#manual-panel-page .edit-smartset-popup");
					}
					else {
						alert(response.error);
					}
				}
				catch(error) {
					alert("getSmartset::error");
				}
			});
		});
		
		$("#manual-panel-page")
		.on("click", ".item .item-active-btn", async function() {
			let itemId = $(this).parents('.item').attr("item-id");
			if (app.editItemsMode) {
				try {
					let response = JSON.parse(await app.arduino.getItem(
							itemId,
							app.currentRoom,
							app.currentProfile,
							app.currentRoom.device.ip_address));
					if (response.outcome != "success") {
						alert(response.error);
						return;
					}
					else {
						app.currentItem = response.item;
						app.changePage("#edit-item-page");
					}
				}
				catch (error) {
					alert("getItem::error");
				}
			}
			else {
				let itemActive;
				if ($(this).parents('.item').attr('active') == 'true') {
					itemActive = 'false';
				}
				else {
					itemActive = 'true';
				}
				
				try {
					let response = JSON.parse(await app.arduino.setItemActive(
							itemId,
							itemActive,
							app.currentRoom,
							app.currentRoom.device.ip_address));

					if (response.outcome == "success") {
						$(this).parents('.item').attr('active', response.active);
					}
					else if (response.outcome == "partial_success") {
						$(this).parents('.item').attr('active', response.active);
						alert(response.message);
					}
					else {
						alert(response.error);
					}
				}
				catch (error) {
					alert("setItemActive::error");
				}
			}
		});
		
		$("#manual-panel-page")
		.on('slidestop', '.item .control-binary .control-widget', async function() {
			let status = {
				type: 'binary',
				value: $(this).val(),
			};
			let controlId = $(this).closest('.control').attr('control-id');
			let itemId = $(this).closest('.item').attr('item-id');
			try {
				let response = JSON.parse(await app.arduino.setControlStatus(
						status,
						controlId,
						itemId,
						app.currentRoom.id,
						app.currentProfile.id,
						app.currentRoom.device.ip_address));
				if (response.outcome == 'success') {
					$(this).val(response.value);
				}
				else if (response.outcome == "partial_success") {
					$(this).val(response.value);
					alert(response.message);
				}
				else {
					alert(response.error);
				}
			}
			catch (error) {
				console.error('setControlStatus::error');
			}
		});
		
		$("#manual-panel-page")
		.on('slidestop focusout', '.item .control-linear .control-widget', async function() {
			let status = {
				type: 'linear',
				value: $(this).val(),
			};
			let controlId = $(this).closest('.control').attr('control-id');
			let itemId = $(this).closest('.item').attr('item-id');
			try {
				let response = JSON.parse(await app.arduino.setControlStatus(
						status,
						controlId,
						itemId,
						app.currentRoom.id,
						app.currentProfile.id,
						app.currentRoom.device.ip_address));
				if (response.outcome == 'success') {
					$(this).val(response.value);
				}
				else if (response.outcome == "partial_success") {
					$(this).val(response.value);
					alert(response.message);
				}
				else {
					alert(response.error);
				}
			}
			catch (error) {
				console.error('setControlStatus::error');
			}
		});
		
		/*$('#manual-panel-page').on('focusout', '.item .control-linear .control-widget', function() {
			alert('bau');
		});*/
		
		$("#manual-panel-page")
		.on("click", ".item .item-smart-btn", async function() {
			let itemId = $(this).parents(".item").attr('item-id');
			try {
				let response = JSON.parse(await app.arduino.getItem(
						itemId,
						app.currentRoom.id,
						app.currentProfile.id,
						app.currentRoom.device.ip_address));
				if (response.outcome == 'success') {
					app.currentItem = response.item;
					if (app.isOpen('#manual-panel-page .smartsets-panel')) {
						await app.close('#manual-panel-page .smartsets-panel');
					}
					app.open('#manual-panel-page .smartsets-panel');
				}
				else {
					alert(response.error);
				}
			}
			catch (error) {
				alert('getItem::error');
				console.error(error);
			}
		});
		
		$("#manual-panel-page .add-btn").click(function() {
			app.changePage("#add-item-page");
		});
		
		$("#manual-panel-page")
		.on("click", ".smartset-popup .smart-item-active-btn", async function() {
			let smartItemId = $(this).parents('.smart-item').attr("smart-item-id");
			let smartItemActive;
			if ($(this).parents('.smart-item').attr('active') == 'true') {
				smartItemActive = 'false';
			}
			else {
				smartItemActive = 'true';
			}

			try {
				let response = JSON.parse(await app.arduino.setSmartItemActive(
						smartItemActive,
						smartItemId,
						app.currentSmartset.id,
						app.currentRoom.id,
						app.currentProfile.id,
						app.currentRoom.device.ip_address));

				if (response.outcome == "success") {
					app.refresh('#manual-panel-page .smartset-popup .smart-items');
				}
				else {
					alert(response.error);
				}
			}
			catch (error) {
				alert("addItemToSmartset::error");
			}
		});
		
		$("#manual-panel-page")
		.on("click", ".smartset-popup .smart-item-remove-btn", async function() {
			let smartItemId = $(this).parents('.smart-item').attr("smart-item-id");
			try {
				let response = JSON.parse(await app.arduino.removeItemFromSmartset(
						smartItemId,
						app.currentSmartset.id,
						app.currentRoom.id,
						app.currentProfile.id,
						app.currentRoom.device.ip_address));

				if (response.outcome == "success") {
					app.refresh('#manual-panel-page .smartset-popup .smart-items');
				}
				else {
					alert(response.error);
				}
			}
			catch (error) {
				alert("removeItemFromSmartset::error");
			}
		});
		
		$("#manual-panel-page")
		.on('slidestop', '.smartset-popup .smart-item .control-binary .control-widget', async function() {
			let smartControl = {
				type: 'binary',
				value: $(this).val(),
			};
			let smartControlId = $(this).closest('.control').attr('control-id');
			let smartItemId = $(this).closest('.smart-item').attr('smart-item-id');
			try {
				let response = JSON.parse(await app.arduino.setSmartControlStatus(
						smartControl,
						smartControlId,
						smartItemId,
						app.currentSmartset.id,
						app.currentRoom.id,
						app.currentProfile.id,
						app.currentRoom.device.ip_address));
				if (response.outcome == 'success') {
					//$(this).val(response.value);
					app.refresh('#manual-panel-page .smartset-popup .smart-items');
				}
				else {
					alert(response.error);
				}
			}
			catch (error) {
				console.error('setSmartControlStatus::error');
			}
		});
		
		$("#manual-panel-page")
		.on('slidestop focusout', '.smartset-popup .smart-item .control-linear .control-widget', async function() {
			let smartControl = {
				type: 'linear',
				value: $(this).val(),
			};
			let smartControlId = $(this).closest('.control').attr('control-id');
			let smartItemId = $(this).closest('.smart-item').attr('smart-item-id');
			try {
				let response = JSON.parse(await app.arduino.setSmartControlStatus(
						smartControl,
						smartControlId,
						smartItemId,
						app.currentSmartset.id,
						app.currentRoom.id,
						app.currentProfile.id,
						app.currentRoom.device.ip_address));
				if (response.outcome == 'success') {
					//$(this).val(response.value);
					app.refresh('#manual-panel-page .smartset-popup .smart-items');
				}
				else {
					alert(response.error);
				}
			}
			catch (error) {
				console.error('setSmartControlStatus::error');
			}
		});
		
		$("#manual-panel-page")
		.on("click", ".add-smartset-popup .cancel-btn", function() {
			app.close('#manual-panel-page .add-smartset-popup');
		});
		
		$("#manual-panel-page")
		.on("click", ".add-smartset-popup .confirm-btn", async function() {
			let newSmartset = {
				name : app.dePrettyfy(
						$('#manual-panel-page .add-smartset-popup .smartset-name').val()),
			};
			if (newSmartset.name != '') {
				try {
					let response = JSON.parse(await app.arduino.addSmartset(
							newSmartset,
							app.currentRoom.id,
							app.currentProfile.id,
							app.currentRoom.device.ip_address));

					if (response.outcome != "success") {
						alert(response.error);
						return;
					}
					let newSmartsetId = response.smartset_id;
					try {
						let response = JSON.parse(await app.arduino.addItemToSmartset(
								newSmartsetId,
								app.currentItem,
								app.currentRoom.id,
								app.currentProfile.id,
								app.currentRoom.device.ip_address));
						if (response.outcome != "success") {
							alert(response.error);
							return;
						}
						app.refresh('#manual-panel-page .ui-content .smartsets');
						app.close('#manual-panel-page .add-smartset-popup');
						app.close('#manual-panel-page .smartsets-panel');
					}
					catch (error) {
						alert("addItemToSmartset::error");
					}
				}
				catch (error) {
					alert("addSmartset::error");
				}
			}
			else {
				alert('invalid input');
			}
		});
		
		$("#manual-panel-page")
		.on("click", ".edit-smartset-popup .cancel-btn", function() {
			app.close('#manual-panel-page .edit-smartset-popup');
		});
		
		$("#manual-panel-page")
		.on("click", ".edit-smartset-popup .confirm-btn", async function() {
			let newSmartset = {
				name : app.dePrettyfy(
						$('#manual-panel-page .edit-smartset-popup .smartset-name').val()),
			};
			if (newSmartset.name != '') {
				try {
					let response = JSON.parse(await app.arduino.editSmartset(
							app.currentSmartset.id,
							newSmartset,
							app.currentRoom.id,
							app.currentProfile.id,
							app.currentRoom.device.ip_address));

					if (response.outcome != "success") {
						alert(response.error);
						return;
					}
					app.refresh('#manual-panel-page .ui-content .smartsets');
					app.refresh('#manual-panel-page .smartsets-panel .smartsets');
					app.close('#manual-panel-page .edit-smartset-popup');
				}
				catch (error) {
					alert("editSmartset::error");
				}
			}
			else {
				alert('invalid input');
			}
		});
		
		$("#manual-panel-page")
		.on("click", ".edit-smartset-popup .remove-btn", async function() {
			try {
				let response = JSON.parse(await app.arduino.removeSmartset(
						app.currentSmartset.id,
						app.currentRoom.id,
						app.currentProfile.id,
						app.currentRoom.device.ip_address));

				if (response.outcome != "success") {
					alert(response.error);
					return;
				}
				app.refresh('#manual-panel-page .ui-content .smartsets');
				app.close('#manual-panel-page .edit-smartset-popup');
			}
			catch (error) {
				alert("editSmartset::error");
			}
		});
		
		$("#manual-panel-page")
		.on("click", ".smartsets-panel .smartset-btn", async function() {
			let smartset_id = $(this).parents('.smartset').attr('smartset-id');
			try {
				let response = JSON.parse(await app.arduino.addItemToSmartset(
						smartset_id,
						app.currentItem,
						app.currentRoom.id,
						app.currentProfile.id,
						app.currentRoom.device.ip_address));
				if (response.outcome == "success") {
					app.close('#manual-panel-page .smartsets-panel');
				}
				else {
					alert(response.error);
				}
			}
			catch (error) {
				alert("addItemToSmartset::error");
			}
		});
		
		$(document).on("pagecreate", "#manual-panel-page", function() {
			$("#manual-panel-page")
			.on("click", ".smartsets-panel .add-to-new-smartset-btn", function() {
				app.open('#manual-panel-page .add-smartset-popup');
			});
		});
		
		$("#manual-panel-page")
		.on("click", ".smartsets-panel .close-panel-btn", function() {
			app.close('#manual-panel-page .smartsets-panel');
		});
		
		
/********** EDIT ITEM *********************************************************/
		
		$('#edit-item-page').on('pagehide', function() {
			app.currentItem = undefined;
			app.selectedPorts = [];
			app.extraPorts = [];
		});
		
		$('#edit-item-page').on('pagebeforeshow', function() {
			$('#edit-item-page .item-icon').attr('name',
					app.currentItem.icon);
			$('#edit-item-page .item-icon').attr('src',
					app.itemIconsPath + app.currentItem.icon + '.png');
			$('#edit-item-page .item-name').val(app.prettyfy(app.currentItem.name));
			app.refresh('#edit-item-page .controls');
			app.load('#edit-item-page .icons', app.itemIcons);
		});
		
		$('#edit-item-page')
		.on('click', function(event) {
			let target = $(event.target);
			let targetParent = target.closest('.ports-collapsible');
			$('.ports-collapsible').each(function() {
				if (!$(this).is(targetParent)) {
					$(this).collapsible('collapse');
				}
			});
		});
		
		$("#edit-item-page .back-btn").click(function() {
			app.currentItem = undefined;
			app.cleanupEditItemPage();
			app.changePage("#manual-panel-page");
		});
		
		$("#edit-item-page .confirm-btn").click(async function() {
			let controls = [];
			$('#edit-item-page .control').each(function() {
				let control = {
					id: $(this).attr('control-id'),
					name: app.dePrettyfy($(this).find('.control-name').val()),
					port: app.dePrettyfy($(this).find('.control-port .title-inner').text()),
					type: $(this).find('.control-type .ui-radio-on').attr('value'),
				};
				if (control.id == undefined) {
					control.id = 'null';
				}
				if (control.type == 'linear') {
					control.min = $(this).find('.linear-min').val();
					control.max = $(this).find('.linear-max').val();
				}
				if (control.name != '' && control.min != '' && control.max != '') {
					controls.push(control);
				}
				else {
					alert('invalid control input');
					return;
				}
			});
			
			var item = {
				name : app.dePrettyfy($("#edit-item-page .item-name").val()),
				icon : $("#edit-item-page .item-icon").attr('name'),
				controls : controls,
			};
			
			if (item.name != "" && item.icon != undefined) {
				try {
					let response = JSON.parse(await app.arduino.editItem(
							item,
							app.currentItem.id,
							app.currentRoom.id,
							app.currentProfile.id,
							app.currentRoom.device.ip_address));
					if (response.outcome == "success") {
						app.changePage("#manual-panel-page");
					}
					else {
						alert(response.error);
					}
				}
				catch (error) {
					console.error("editItem::error");
				}
			}
			else {
				alert("invalid data");
			}
		});
		
		$("#edit-item-page")
		.on("click", ".remove-control-btn", function() {
			let $portsTitle = $(this).closest('.control').find(
					'.ports-collapsible .title-inner');
			let index = $.inArray(
					app.dePrettyfy($portsTitle.text()),
					app.selectedPorts);
			if (index != -1) {
				app.selectedPorts.splice(index, 1);
			}
			let elementIndex = $(this).parents('.control').index();
			app.removeElement("#edit-item-page .controls", elementIndex);
		});
		
		$("#edit-item-page")
		.on("change", ".control-type .ui-radio", function() {
			let $label = $(this).find('label');
			let $control = $(this).closest('.control');
			$control.find('.linear-options').addClass('hidden');
			if ($label.hasClass('linear-type-btn')) {
				$control.find('.linear-options').removeClass('hidden');
			}
		});
		
		/*$("#edit-item-page")
		.on("click", ".binary-type-btn", function() {
			$(this).parents('.control').find('.linear-options').addClass('hidden');
		});
		
		$("#edit-item-page")
		.on("click", ".linear-type-btn", function() {
			$(this).parents('.control').find('.linear-options').removeClass('hidden');
		});*/
		
		$('#edit-item-page')
		.on('collapsibleexpand', '.ports-collapsible', function(event) {
			let target = $(event.target);
			let collapsible = target.closest('.ports-collapsible');
			$('.ports-collapsible').each(function() {
				if (!$(this).is(collapsible)) {
					$(this).collapsible('collapse');
				}
			});
			app.refreshTarget(collapsible);
		});
		
		$("#edit-item-page")
		.on("click", ".port-btn", function() {
			let $title = $(this).closest('.ports-collapsible').find('.title-inner');
			let $entry = $(this).find('.port-name');
			let index = $.inArray(
					app.dePrettyfy($title.text()),
					app.selectedPorts);
			if (index != -1) {
				app.selectedPorts.splice(index, 1);
			}
			app.selectedPorts.push(app.dePrettyfy($entry.text()));
			$title.text($entry.text());
			$title.closest('.ports-collapsible').collapsible('collapse');
		});
		
		$("#edit-item-page")
		.on("click", ".add-control-btn", function() {
			app.addElement("#edit-item-page .controls");
		});
		
		/*$("#edit-item-page")
		.on("click", ".port-btn", function() {
			let title = $('#edit-item-page .ports .title-inner');
			title.html($(this).find('.port-name').html());
			title.parents('.ports-collapsible').collapsible('collapse');
		});*/
		
		$('#edit-item-page')
		.on("click", ".icon-btn", function() {
			$('#edit-item-page .item-icon').attr(
					'name',
					$(this).find('.icon').attr('name'));
			$('#edit-item-page .item-icon').attr(
					'src',
					$(this).find('img').attr('src'));
		});
		
		$("#edit-item-page .remove-btn").click(function() {
			app.arduino.removeItem(
					app.currentItem,
					app.currentRoom,
					app.currentRoom.device.ip_address)
			.then(function(result) {
				var response = JSON.parse(result);

				if (response.outcome == "success") {
					app.currentItem = undefined;
					app.cleanupEditItemPage();
					app.changePage("#manual-panel-page");
				}
				else {
					alert(response.error);
				}
			})
			.catch(function() {
				alert("removeItem::error");
			});
		});
		
/********** ADD ITEM **********************************************************/
		
		$('#add-item-page').on('pagehide', function() {
			app.selectedPorts = [];
			app.extraPorts = [];
		});
		
		$('#add-item-page').on('pagebeforeshow', function() {
			$('#add-item-page .item-icon').attr('name',
					app.defaultItemIcon);
			$('#add-item-page .item-icon').attr('src',
					app.itemIconsPath + app.defaultItemIcon + '.png');
			$('#add-item-page .item-name').val('');
			$('#add-item-page .controls').html('');
			app.load('#add-item-page .icons', app.itemIcons);
		});
		
		$('#add-item-page')
		.on('click', function(event) {
			let target = $(event.target);
			let targetParent = target.closest('.ports-collapsible');
			$('.ports-collapsible').each(function() {
				if (!$(this).is(targetParent)) {
					$(this).collapsible('collapse');
				}
			});
		});
		
		$("#add-item-page .back-btn").click(function() {
			app.cleanupAddItemPage();
			app.changePage("#manual-panel-page");
		});
		
		$("#add-item-page .confirm-btn").click(function() {
			let controls = [];
			$('#add-item-page .control').each(function() {
				let control = {
					name: app.dePrettyfy($(this).find('.control-name').val()),
					port: app.dePrettyfy($(this).find('.control-port .title-inner').text()),
					type: $(this).find('.control-type .ui-radio-on').attr('value'),
				};
				if (control.type == 'linear') {
					control.min = $(this).find('.linear-min').val();
					control.max = $(this).find('.linear-max').val();
				}
				if (control.name != '' && control.min != '' && control.max != '') {
					controls.push(control);
				}
				else {
					alert('invalid control input');
					return;
				}
			});
			
			var newItem = {
				name : app.dePrettyfy($("#add-item-page .item-name").val()),
				icon : $("#add-item-page .item-icon").attr('name'),
				controls : controls,
			};
			
			if (newItem.name != "" && newItem.icon != undefined) {
				app.arduino.addItem(
						newItem,
						app.currentRoom,
						app.currentRoom.device.ip_address)
				.then(function(result) {
					var response = JSON.parse(result);

					if (response.outcome == "success") {
						app.cleanupAddItemPage();
						app.changePage("#manual-panel-page");
					}
					else {
						alert(response.error);
					}
				})
				.catch(function() {
					alert("addItem::error");
				});
			}
			else {
				alert("invalid data");
			}
		});
		
		$("#add-item-page")
		.on("click", ".remove-control-btn", function() {
			let $portsTitle = $(this).closest('.control').find(
					'.ports-collapsible .title-inner');
			let index = $.inArray(
					app.dePrettyfy($portsTitle.text()),
					app.selectedPorts);
			if (index != -1) {
				app.selectedPorts.splice(index, 1);
			}
			let elementIndex = $(this).parents('.control').index();
			app.removeElement("#add-item-page .controls", elementIndex);
		});
		
		$("#add-item-page")
		.on("change", ".control-type .ui-radio", function() {
			let $label = $(this).find('label');
			let $control = $(this).closest('.control');
			$control.find('.linear-options').addClass('hidden');
			if ($label.hasClass('linear-type-btn')) {
				$control.find('.linear-options').removeClass('hidden');
			}
		});
		
		/*$("#add-item-page")
		.on("click", ".binary-type-btn", function() {
			$(this).parents('.control').find('.linear-options').addClass('hidden');
		});
		
		$("#add-item-page")
		.on("click", ".linear-type-btn", function() {
			$(this).parents('.control').find('.linear-options').removeClass('hidden');
		});*/
		
		$('#add-item-page')
		.on('collapsibleexpand', '.ports-collapsible', function(event) {
			let target = $(event.target);
			let collapsible = target.closest('.ports-collapsible');
			$('.ports-collapsible').each(function() {
				if (!$(this).is(collapsible)) {
					$(this).collapsible('collapse');
				}
			});
			app.refreshTarget(collapsible);
		});
		
		$("#add-item-page")
		.on("click", ".port-btn", function() {
			let $title = $(this).closest('.ports-collapsible').find('.title-inner');
			let $entry = $(this).find('.port-name');
			let index = $.inArray(
					app.dePrettyfy($title.text()),
					app.selectedPorts);
			if (index != -1) {
				app.selectedPorts.splice(index, 1);
			}
			app.selectedPorts.push(app.dePrettyfy($entry.text()));
			$title.text($entry.text());
			$title.closest('.ports-collapsible').collapsible('collapse');
		});
		
		$("#add-item-page")
		.on("click", ".add-control-btn", function() {
			app.addElement("#add-item-page .controls");
		});
		
		$('#add-item-page')
		.on("click", ".icon-btn", function() {
			$('#add-item-page .item-icon').attr(
					'name',
					$(this).find('.icon').attr('name'));
			$('#add-item-page .item-icon').attr(
					'src',
					$(this).find('img').attr('src'));
		});
		
/********** SMARTSETS *********************************************************/
		
		/*$("#smartsets-page .back-btn").click(function() {
			app.changePage("#manual-panel-page");
		});
		
		$("#smartsets-page")
		.on("click", ".smartset .open-btn", function() {
			app.arduino.getSmartset(
					$(this).parent().attr('id'),
					app.currentProfile,
					app.currentRoom)
			.then(function(result) {
				let response = JSON.parse(result);

				if (response.outcome == "success") {
					app.currentSmartset = response.smartset;
					app.changePage("#smart-items-page");
				}
				else {
					alert(response.error);
				}
			})
			.catch(function() {
				alert("getSmartset::error");
			});
		});
		
		$("#smartsets-page")
		.on("click", ".smartset .edit-btn", function() {
			app.arduino.getSmartset(
					$(this).parent().attr('id'),
					app.currentProfile,
					app.currentRoom)
			.then(function(result) {
				let response = JSON.parse(result);

				if (response.outcome == "success") {
					app.currentSmartset = response.smartset;
					app.changePage("#edit-smartset-page");
				}
				else {
					alert(response.error);
				}
			})
			.catch(function() {
				alert("getSmartset::error");
			});
		});
		
		$("#smartsets-page")
		.on("click", ".add-btn", function() {
			app.changePage("#add-smartset-page");
		});*/
		
/********** ADD SMARTSET ******************************************************/
		
		/*$("#add-smartset-page .back-btn").click(function() {
			app.changePage("#smartsets-page");
		});
		
		$("#add-smartset-page .confirm-btn").click(function() {
			var smartset = {
				name : app.dePrettyfy(
						$("#add-smartset-page input[name='name']").val()),
			};
			
			if (smartset.name != "") {
				app.arduino.addSmartset(
						smartset,
						app.currentRoom,
						app.currentProfile)
				.then(function(result) {
					var response = JSON.parse(result);

					if (response.outcome == "success") {
						if (app.currentItem) {
							app.arduino.getSmartsetByName(
									smartset.name,
									app.currentRoom,
									app.currentProfile)
							.then(function(result) {
								var response = JSON.parse(result);

								if (response.outcome == "success") {
									app.arduino.addItemToSmartset(
											response.smartset.id,
											app.currentItem,
											app.currentProfile,
											app.currentRoom)
									.then(function(result) {
										var response = JSON.parse(result);

										if (response.outcome == "success") {
											$('#manual-panel-page .smartsets-panel').css('display', 'block');
											app.refreshSmartsetsPanel();
							
											
											app.changePage("#manual-panel-page");
										}
										else {
											alert(response.error);
										}
									})
									.catch(function() {
										alert("addItemToSmartset::error");
									});
								}
								else {
									alert(response.error);
								}
							})
							.catch(function() {
								alert("getSmartsetByName::error");
							});
						}
						else {
							
							app.changePage("#smartsets-page");
						}
					}
					else {
						alert(response.error);
					}
				})
				.catch(function() {
					alert("addSmartset::error");
				});
			}
			else {
				alert("invalid data");
			}
		});*/
		
/********** EDIT SMARTSET *****************************************************/
		
		/*$("#edit-smartset-page .back-btn").click(function() {
			app.currentSmartset = undefined;
			app.changePage("#smartsets-page");
		});
		
		$("#edit-smartset-page .confirm-btn").click(function() {
			var newSmartset = {
				name : app.dePrettyfy(
						$("#edit-smartset-page input[name='name']").val()),
			};
			
			if (newSmartset.name != "") {
				app.arduino.editSmartset(
						app.currentSmartset,
						newSmartset,
						app.currentRoom,
						app.currentProfile)
				.then(function(response) {
					var outcome = JSON.parse(response).outcome;

					if (outcome == "success") {
						
						app.currentSmartset = undefined;
						app.changePage("#smartsets-page");
					}
					else {
						alert(JSON.parse(response).error);
					}
				})
				.catch(function() {
					alert("editSmartset::error");
				});
			}
			else {
				alert("invalid data");
			}
		});
		
		$("#edit-smartset-page .remove-btn").click(function() {
			app.arduino.removeSmartset(
					app.currentSmartset.id,
					app.currentRoom,
					app.currentProfile)
			.then(function(result) {
				var response = JSON.parse(result);

				if (response.outcome == "success") {
					
					app.currentSmartset = undefined;
					app.changePage("#manual-panel-page");
				}
				else {
					alert(response.error);
				}
			})
			.catch(function() {
				alert("removeSmartset::error");
			});
		});*/
		
		
/********** SMART ITEMS *******************************************************/
		
		/*$("#smart-items-page .back-btn").click(function() {
			app.changePage("#smartsets-page");
		});
			
		$('#smart-items-page')
		.on('click', '.smart-item .active-btn', function() {
			let itemData = $(this).parent();
			let item = {
				id : itemData.attr('id'),
				active : (!(itemData.attr('active') == 'true')).toString(),
			};
			
			app.arduino.addItemToSmartset(
					app.currentSmartset.id,
					item,
					app.currentProfile,
					app.currentRoom)
			.then(function(result) {
				let response = JSON.parse(result);

				if (response.outcome == "success") {
					app.changePage("#smart-items-page");
				}
				else {
					alert(response.error);
				}
			})
			.catch(function() {
				alert("addItemToSmartset::error");
			});
		});
		
		$('#smart-items-page')
		.on('click', '.smart-item .delete-btn', function() {
			let smartItemId = $(this).parent().attr('id');
			
			app.arduino.removeItemFromSmartset(
					smartItemId,
					app.currentSmartset,
					app.currentRoom,
					app.currentProfile)
			.then(function(result) {
				let response = JSON.parse(result);

				if (response.outcome == "success") {
					app.changePage("#smart-items-page");
				}
				else {
					alert(response.error);
				}
			})
			.catch(function() {
				alert("removeItemFromSmartset::error");
			});
		});*/
		
	},
/********** FUNCTIONS *********************************************************/
	
	refreshDevices: function() {
		app.availableDevices = [];
		app.refreshDevicesContainer();

		// button() call initializes the button, preventing an error when
		// calling this function on page change
		$("#sign-in-page .submit-btn").button().button("disable");

		app.arduino.searchDevices();
		/*
		app.arduino.searchDevices()
			.then(function (result) {
				app.refreshDevices(result);
			})
			.catch(function () {
				alert("app::getDevices::error");
			});
		*/
	},
	
	refreshDevicesContainer: function() {
		var container = $(".devices-container");
		container.html("");
		
		if (app.availableDevices.length == 0) {
			container.html("<p>no smart devices found</p>");
		}
		else {
			for(var index = 0; index < app.availableDevices.length; index++) {
				container.append(
						"<label class=\"device\">" +
						app.availableDevices[index].name +
						"<input type=\"radio\" name=\"available-devices\" " +
						"device-name=\"" + app.availableDevices[index].name + "\" " +
						"address=\"" + app.availableDevices[index].address + "\">" +
						"</label>");
			}
			
			$("#sign-in-page .device").click(function() {
				$("#sign-in-page .submit-btn").button("enable");
			});
		}
		$(container).enhanceWithin();
	},
	
	/*refreshProfiles: function(profiles) {
		var container = $(".profiles-container");
		container.html("");
		
		for (let index = 0; index < profiles.length; index++) {	
			let profile = profiles[index];
			container.append(
				'<button type="submit" ' +
				'id="' + profile.id + '" ' +
				'class="profile" ' +
				'">' +
				'<img src="img/profiles/' + profile.avatar +
				'.png" width="130px" height="130px"/>' +
				'<h3>' + profile.name + '</h3>' +
				'</button>');
		}
		$(container).enhanceWithin();
		
		if (container.html() == "") {
			container.html("<p>There aren't any profiles yet</p>");
		}
	},*/
	
	/*refreshProfilesList: function() {
		app.arduino.getProfiles()
		.then(function(result) {
			var response = JSON.parse(result);

			if (response.outcome == "success") {
				app.loadProfilesList(response.profiles);
			}
			else {
				alert(response.error);
			}
		})
		.catch(function() {
			alert("getProfiles::error");
		});
	},*/
	
	/*loadProfilesList: function(profiles) {
		var container = $(".profiles-list");
		container.html("");
		
		for (let index = 0; index < profiles.length; index++) {
			let blockType = app.toBlockType(index % 2);
			let profile = profiles[index];
			container.append(
				'<div class="centered-list-block ' +
						'ui-block-' + blockType +
				'">' +
					'<a class="profile-btn ' +
							'ui-btn ' +'ui-icon-edit ui-btn-icon-top" '
					'">' +
						'<div class="profile" ' +
								'id="' + profile.id + '" ' +
						'">' +
							'<img class="profile-avatar" src="img/profiles/' +
									profile.avatar + '.png" ' +
									'width="120px" height="120px" ' + 
							'/>' +
							'<h2 class="profile-name">' +
									profile.name +
							'</h2>' +
						'</div>' +
					'</a>' +
				'</div>');
		}
		$(container).enhanceWithin();
		
		if (container.html() == "") {
			container.html("<p></p>");
		}
	},*/
	
	refreshProfileInfo: function(profile) {
		var container = $(".profile-container");
		container.html("<img src=\"img/profiles/" + profile.avatar + "\" " +
				"width=\"250px\" height=\"250px\"/> " + 
				"<h2>" + profile.name + "</h2>");
	},
	
	loadProfileAvatars: function(avatars, container) {
		if (avatars.length > 0) {
			container.html("");
			for (let i = 0; i < avatars.length; i++) {
				container.append(
						'<div class="ui-block-' + app.toBlockType(i % 5) + '">' +
							'<a class="avatar-btn ui-btn">' +
								'<img class="avatar" name="' + avatars[i] + '" ' +
										'src=\"img/profiles/' + avatars[i] + '.png\" ' +
										'width=\"70px\" height=\"70px\" ' +
								'>' +
							'</a>' +
						'</div>');
			}
		}
		/*else {
			container.html("<p>No avatars found</p>");
		}*/
		$(container).enhanceWithin();
	},
	
	refreshRoomIcons: function(icons) {
		var length = icons.length;
		
		if (length > 0) {
			var container = $(".room-icons-container");
			container.html("");
			
			for (let index = 0; index < length; index++) {
				container.append("<label class=\"room-icon\">" +
						"<input type=\"radio\" name=\"room-icons\" value=\"" +
						icons[index] + "\">" +
						"<img src=\"img/rooms/" + icons[index] + ".png\" " +
						"width=\"100px\" height=\"100px\">" + 
						"</label>");
			}
		}
		else {
			container.html("<p>No icons found</p>");
		}
		
		$(container).enhanceWithin();
	},
	
	/*refreshItemIcons: function(icons) {
		var length = icons.length;
		
		if (length > 0) {
			var container = $(".item-icons-container");
			container.html("");
			
			for (let index = 0; index < length; index++) {
				container.append("<label class=\"item-icon\">" +
						"<input type=\"radio\" name=\"item-icons\" value=\"" +
						icons[index] + "\">" +
						"<img src=\"img/items/" + icons[index] + ".png\" " +
						"width=\"50px\" height=\"50px\">" + 
						"</label>");
			}
		}
		else {
			container.html("<p>No icons found</p>");
		}
		
		$(container).enhanceWithin();
	},*/
	
	/*refreshRooms: function() {
		app.arduino.getRooms(app.currentProfile)
		.then(function(result) {
			var response = JSON.parse(result);

			if (response.outcome == "success") {
				app.loadRooms(
						response.rooms,
						$("#control-panel-page .rooms"));
			}
			else {
				alert(response.error);
			}
		})
		.catch(function() {
			alert("getRooms::error");
		});
	},*/
	
	/*loadRooms: function(rooms, container) {
		container.html("");
		for (let index = 0; index < rooms.length; index++) {
			let room = rooms[index];
			container.append(
				'<li class="room" room-id="' + room.id + '" smart="false">' +
					'<a class="room-smart-btn">' +
						'<img class="room-icon"' +
								'src="img/rooms/' + room.icon + '.png">' +
						'<h2 class="room-name">' + room.name + '</h2>' +
					'</a>' +
					'<a class="room-manual-btn" data-icon="gear"></a>' +
				'</li>'
			);
		}
		
		container.listview("refresh");
		
		if (container.html() == "") {
			container.html("<p>There aren't any rooms yet</p>");
		}
	},*/
	
	/*refreshItems: function(items) {
		var container = $(".items-list");
		container.html("");
		
		for (let index = 0; index < items.length; index++) {
			let item = items[index];
			let prettifiedName = app.prettyfy(item.name);
			
			if (index > 0) {
				container.append('<hr>');
			}
			
			container.append(
					'<div class="item" id="' + item.id +'" ' +
							'active="' + item.active + '" ' +
							'smart="' + item.smart + '">' +
						'<button type="submit" class="active-btn">' +
							'<img src="img/items/' + item.icon + '.png"' +
								' width="50px"' +
								'height="50px"/>' +
							'<h3>' + prettifiedName + '</h3>' +
						'</button>' +
						'<div class="smart-container">' +
							'<div class="smart">' +
								'<button type="submit" class="on-btn">' +
									'<p>smart on</p>' +
								'</button>' +
							'</div>' +
						'</div>' +
					'</div>'
			);
		}
		$(container).enhanceWithin();
		
		if (container.html() == "") {
			container.html("<p>There aren't any items in this room yet</p>");
		}
	},*/
	
	
/********** OPEN **************************************************************/
	
	isOpen: function(selector) {
		let target = $(selector);
		
		if (target.is($('#control-panel-page .footer'))) {
			if (target.position().top < $(window).height()) {
				return true;
			}
			else {
				return false;
			}
		}
		
		if (target.is($('#manual-panel-page .smartsets-panel'))) {
			if (target.position().top < $(window).height()) {
				return true;
			}
			else {
				return false;
			}
		}
		
		else {
			alert('isOpen::error - target not found');
		}
	},
	
	
/********** OPEN **************************************************************/
	
	open: async function(selector) {
		let target = $(selector);
		
		if (target.is($('#control-panel-page .footer'))) {
			return target.animate({
				'top': $(window).height() - target.height(),
			}, 300).promise();
		}
		
		else if (target.is($('#manual-panel-page .smartsets-panel'))) {
			await app.refresh(selector + ' ' + '.smartsets');
			target.animate({
				'top': $(window).height() - target.height(),
			}, 300);
		}
		
		else if (target.is($('#manual-panel-page .smartset-popup'))) {
			await app.refresh('#manual-panel-page .smartset-popup .smart-items');
			$('#manual-panel-page .smartset-popup').popup("open");
		}
		
		else if (target.is($('#manual-panel-page .add-smartset-popup'))) {
			$('#manual-panel-page .add-smartset-popup .smartset-name').val('');
			$('#manual-panel-page .add-smartset-popup').popup("open");
		}
		
		else if (target.is($('#manual-panel-page .edit-smartset-popup'))) {
			app.load('#manual-panel-page .edit-smartset-popup form');
			$('#manual-panel-page .edit-smartset-popup').popup("open");
		}
		
		else {
			alert('open::error - target not found');
		}
	},
	
/********** CLOSE *************************************************************/
	
	close: function(selector, animationtime) {
		let target = $(selector);
		if (animationtime == undefined) {
			animationtime = 300;
		}
		
		if (target.is($('#control-panel-page .footer'))) {
			return target.animate(
					{'top': $(window).height(),},
					animationtime).promise();
		}
		
		else if (target.is($('#add-room-page .devices-collapsible'))) {
			return target.collapsible('collapse').promise();
		}
		
		else if (target.is($('#manual-panel-page .smartsets-collapsible'))) {
			return target.collapsible('collapse').promise();
		}
		
		else if (target.is($('#manual-panel-page .smartsets-panel'))) {
			return target.animate(
					{'top': $(window).height(),},
					animationtime).promise();
		}
		
		else if (target.is($('#manual-panel-page .add-smartset-popup'))) {
			return target.popup('close').promise();
		}
		
		else if (target.is($('#manual-panel-page .edit-smartset-popup'))) {
			return target.popup('close').promise();
		}
		
		/*else if (target.is($('#add-item-page .ports-collapsible')) ||
				target.is($('#edit-item-page .ports-collapsible'))) {
			return target.collapsible('collapse').promise();
		}*/
		
		else {
			alert('close::error - target not found');
		}
	},	
	
/********** REFRESH ***********************************************************/
	
	refresh: async function(selector) {
		let target = $(selector);
		
		if (target.is($("#profiles-page .profiles"))) {
			try {
				let response = await app.arduino.coopGetProfiles();

				if (response.outcome == "success") {
					app.load(selector, response.profiles);
				}
				else {
					alert(response.error);
				}
			}
			catch (error) {
				alert("getProfiles::error");
			}
		}
		
		else if (target.is($("#control-panel-page .footer .smartsets"))) {
			return app.arduino.getSmartsets(
					app.currentRoom,
					app.currentProfile,
					app.currentRoom.device.ip_address)
			.then(function(result) {
				var response = JSON.parse(result);

				if (response.outcome == "success") {
					app.load(selector, response.smartsets);
				}
				else {
					alert(response.error);
				}
			})
			.catch(function() {
				alert("getSmartsets::error");
			});
		}
		
		else if (target.is($("#control-panel-page .rooms"))) {
			let currentProfileId = app.currentProfile.id;
			try {
				let response = await app.arduino.coopGetRooms(currentProfileId);
				if (response.outcome != "success") {
					alert(response.error);
					return;
				}
				app.load(selector, response.rooms);
				let cachedProfiles = [];
				for (let localData of response.rooms) {
					for (let room of localData.localRooms) {
						try {
							let response = JSON.parse(
									await app.arduino.getActiveSmartsets(
											room.id,
											localData.device.ip_address));
							if (response.outcome != "success") {
								alert(response.error);
								return;
							}
							let activeProfiles = [];
							for (let smartset of response.active_smartsets) {
								let profile = undefined;
								for (let cachedProfile of cachedProfiles) {
									if (cachedProfile.id == smartset.owner_id) {
										profile = cachedProfile;
									}
								}
								if (profile == undefined) {
									try {
										let response = await app.arduino.coopGetProfile(smartset.owner_id);
										if (response.outcome != "success") {
											alert(response.error);
											return;
										}
										profile = response.profile;
										cachedProfiles.push(profile);
									}
									catch(e) {
										alert('getProfile::error');
									}
								}
								activeProfiles.push(profile);
								if (profile.id == currentProfileId) {
									$(selector + ' .room[room-id="' + room.id + '"] .room-smart-btn').addClass('ui-btn-active'/*'enhanced'*/);
								}
							}
							let innerSelector = selector + ' .room[room-id="' + room.id + '"] .active-profiles';
							app.load(innerSelector, activeProfiles);
						}
						catch (e) {
							alert('getActiveSmartsets::error');
						}
					}
				}
			}
			catch (e) {
				alert('getRooms::error');
			}
		}
		
		else if (target.is($("#manual-panel-page .ui-content .smartsets"))) {
			/*return app.arduino.getSmartsets(
							app.currentRoom,
							app.currentProfile)
			.then(function(result) {
				var response = JSON.parse(result);
				
				if (response.outcome != "success") {
					alert(response.error);
					return;
				}
				app.load(selector, response.smartsets);
			})
			.catch(function() {
				alert("getSmartsets::error");
			});*/
			try {
				let response = JSON.parse(await app.arduino.getSmartsets(
						app.currentRoom,
						app.currentProfile,
						app.currentRoom.device.ip_address));
				if (response.outcome != "success") {
					alert(response.error);
					return;
				}
				app.load(selector, response.smartsets);
			}
			catch(error) {
				alert("getSmartsets::error");
			}
		}
		
		else if (target.is($('#manual-panel-page .smartset-popup .smart-items'))) {
			try {
				let response = JSON.parse(await app.arduino.getItems(
						app.currentRoom.id,
						app.currentProfile.id,
						app.currentRoom.device.ip_address));
				if (response.outcome != "success") {
					alert(response.error);
					return;
				}
				let items = response.items;
				try {
					let response = JSON.parse(await app.arduino.getSmartItems(
							app.currentSmartset.id,
							app.currentRoom.id,
							app.currentProfile.id,
							app.currentRoom.device.ip_address));
					if (response.outcome != "success") {
						alert(response.error);
						return;
					}
					let smartItems = response.smart_items;
					for (let smartItem of smartItems) {
						let originItem = undefined;
						for (let item of items) {
							if (item.id == smartItem.id) {
								originItem = item;
							}
						}
						smartItem.name = originItem.name;
						smartItem.icon = originItem.icon;
						try {
							let response = JSON.parse(
										await app.arduino.getControls(
									smartItem.id,
									app.currentRoom.id,
									app.currentProfile.id,
									app.currentRoom.device.ip_address));
							if (response.outcome != "success") {
								alert(response.error);
								return;
							}
							let controls = response.controls;
							try {
								let response = JSON.parse(
											await app.arduino.getSmartControls(
										smartItem.id,
										app.currentSmartset.id,
										app.currentRoom.id,
										app.currentProfile.id,
										app.currentRoom.device.ip_address));
								if (response.outcome != "success") {
									alert(response.error);
									return;
								}
								let smartControls = response.smart_controls;
								for (let smartControl of smartControls) {
									let originControl = undefined;
									for (let control of controls) {
										if (control.id == smartControl.id) {
											originControl = control;
										}
									}
									smartControl.name = originControl.name;
								}
								smartItem.smartControls = smartControls;
							}
							catch (error) {
								alert('getSmartControls::error');
							}
						}
						catch (error) {
							alert('getControls::error');
						}
					}
					app.load(selector, smartItems);
				}
				catch (error) {
					alert('getSmartItems::error');
				}
			}
			catch (error) {
				alert('getItems::error');
			}
		}
		
		else if (target.is($("#manual-panel-page .items"))) {
			try {
				let response = JSON.parse(await app.arduino.getItems(
						app.currentRoom.id,
						app.currentProfile.id,
						app.currentRoom.device.ip_address));
				if (response.outcome == "success") {
					app.load(selector, response.items);
					for (let item of response.items) {
						let $item = target.find('.item[item-id=' + item.id + ']');
						try {
							let response = JSON.parse(await app.arduino.getControls(
									item.id,
									app.currentRoom.id,
									app.currentProfile.id,
									app.currentRoom.device.ip_address));
							if (response.outcome == "success") {
								app.loadTarget(
										$item.find('.item-controls'),
										response.controls);
							}
							else {
								alert(response.error);
							}
						}
						catch (error) {
							console.error("getControls::error");
						}
					}
				}
				else {
					alert(response.error);
				}
			}
			catch (error) {
				alert("getItems::error");
			}
		}
		
		else if (target.is($('#manual-panel-page .smartsets-panel .smartsets'))) {
			try {
				let response = JSON.parse(await app.arduino.getSmartsets(
						app.currentRoom,
						app.currentProfile,
						app.currentRoom.device.ip_address));
				if (response.outcome == "success") {
					app.load(selector, response.smartsets);
				}
				else {
					alert(response.error);
				}
			}
			catch (error) {
				alert("getSmartsets::error");
			}
		}
		
		else if (target.is($("#edit-item-page .controls"))) {
			try {
				let response = JSON.parse(await app.arduino.getControls(
						app.currentItem.id,
						app.currentRoom.id,
						app.currentProfile.id,
						app.currentRoom.device.ip_address));
				if (response.outcome == "success") {
					for (let control of response.controls) {
						app.selectedPorts.push(control.port);
						app.extraPorts.push(control.port);
					}
					app.load(target, response.controls);
				}
				else {
					alert(response.error);
					return;
				}
			}
			catch (error) {
				console.error("getControls::error");
			}
		}
		
		/*else if (target.is($("#add-item-page .ports")) ||
				target.is($("#edit-item-page .ports"))) {
			try {
				let response = JSON.parse(await app.arduino.getPorts(
						app.currentRoom.device.ip_address));
				if (response.outcome != "success") {
					alert(response.error);
					return;
				}
				app.load(selector, response.ports);
			}
			catch(error) {
				alert("getPorts::error");
			}
		}*/
		
		else {
			alert('refresh::error - target not found');
		}
	},
	
/********** REFRESH TARGET ****************************************************/
	
	refreshTarget: async function(target) {
		if (target.hasClass('ports-collapsible')) {
			try {
				let response = JSON.parse(await app.arduino.getPorts(
						app.currentRoom.device.ip_address));
				if (response.outcome == 'success') {
					app.loadTarget(target, response.ports);
				}
				else {
					console.error(response.error);
				}
			}
			catch (error) {
				console.error('getPorts::error');
			}
		}
		
		/*else if (target.hasClass('item-controls')) {
			try {
				let response = JSON.parse(await app.arduino.getControls(
						target.closest('.item').attr('item-id'),
						app.currentRoom.id,
						app.currentProfile.id,
						app.currentRoom.device.ip_address));
				if (response.outcome == "success") {
					//app.loadTarget(target, response.controls);
				}
				else {
					alert(response.error);
				}
			}
			catch (error) {
				console.error("getControls::error");
			}
		}*/
		
		else {
			console.error('refreshTarget::error - target not found');
		}
	},
	
	
/********** LOAD **************************************************************/
	
	load: function(selector, data) {
		let target = $(selector);
		
		if (target.is($('#profiles-page .profiles'))) {
			target.html("");

			for (let i = 0; i < data.length; i++) {
				let blockType = app.toBlockType(i % 2);
				let profile = data[i];
				target.append(
					'<div class="centered-list-block ' +
							'ui-block-' + blockType +
					'">' +
						'<a class="profile-btn ' +
								'ui-btn ' +
						'">' +
							'<div class="profile" ' +
									'id="' + profile.id + '" ' +
							'">' +
								'<img class="profile-avatar" src="img/profiles/' +
										profile.avatar + '.png" ' +
										'width="120px" height="120px" ' + 
								'/>' +
								'<h2 class="profile-name">' +
										app.prettyfy(profile.name) +
								'</h2>' +
							'</div>' +
						'</a>' +
					'</div>');
			}
			//$(container).enhanceWithin();

			/*if (container.html() == "") {
				container.html("<p></p>");
			}*/
		}
		
		else if (target.is($("#add-profile-page .avatars")) ||
				target.is($("#edit-profile-page .avatars"))) {
			target.html("");
			for (let i = 0; i < data.length; i++) {
				target.append(
						'<div class="centered-list-block ui-block-' + app.toBlockType(i % 4) + '">' +
							'<a class="avatar-btn ui-btn">' +
								'<img class="avatar" name="' + data[i] + '" ' +
										'src=\"img/profiles/' + data[i] + '.png\" ' +
										'width=\"70px\" height=\"70px\" ' +
								'>' +
							'</a>' +
						'</div>');
			}
		}
		
		else if (target.is($('#control-panel-page .footer .smartsets'))) {
			target.html("");
			
			for (let i = 0; i < data.length; i++) {
				let smartset = data[i];
				target.append(
					'<li ' +
						'class="smartset" ' +
						'data-icon="false" ' +
						'smartset-id="' + smartset.id + '" ' +
					'>' +
						'<a class="smartset-btn">' +
							'<h3 class="smartset-name">' +
								app.prettyfy(smartset.name) +
							'</h3>' +
						'</a>' +
					'</li>'
				);
			}
			target.listview("refresh");
		}
		
		else if (target.is($("#control-panel-page .rooms"))) {
			target.html("");
			for (let localData of data) {
				for (let room of localData.localRooms) {
					target.append(
						'<li class="room" room-id="' + room.id + '" ' +
								'device-ip="' + localData.device.ip_address + '" ' +
								'smart="false" ' +
						'>' +
							'<a class="room-smart-btn">' +
								'<img class="room-icon"' +
										'src="img/rooms/' + room.icon + '.png">' +
								'<h2 class="room-name">' + app.prettyfy(room.name) + '</h2>' +
								'<div class="active-profiles"></div>' +
							'</a>' +
							'<a class="room-manual-btn" data-icon="gear"></a>' +
						'</li>'
					);
				}
			}
			target.listview("refresh");
		}
		
		else if (target.hasClass('active-profiles')) {
			target.html("");
			for (let profile of data) {
				target.append(
					'<img class="active-profile-avatar" ' +
							'src="img/profiles/' + profile.avatar + '.png" ' +
							'width="50px" height="50px">'
				);
			}
		}
		
		else if (target.is($("#add-room-page .devices"))) {
			let title = target.find('.title-inner');
			target = target.find('.devices-listview');
			target.html("");
			/*target.append(
					'<li class="device" data-icon="false">' +
						'<a class="device-btn">' +
							'<h3 class="device-name">none</h3>' +
						'</a>' +
					'</li>');*/
			for (let i = 0; i < data.length; i++) {
				let device = data[i];
				target.append(
					'<li class="device" ' +
							'device-ip="' + device.ip_address + '" ' +
							'data-icon="false">' +
						'<a class="device-btn">' +
							'<h3 class="device-name">' +
								app.prettyfy(device.name) +
							'</h3>' +
						'</a>' +
					'</li>'
				);
			}
			title.html(target.children().first().find('.device-name').html());
			title.parents('.title').attr(
					'device-ip',
					target.children().first().attr('device-ip'));
			target.listview("refresh");
		}
		
		else if (target.is($("#add-room-page .icons")) ||
				target.is($("#edit-room-page .icons"))) {
			target.html("");
			for (let i = 0; i < data.length; i++) {
				target.append(
						'<div class="centered-list-block ui-block-' + app.toBlockType(i % 4) + '">' +
							'<a class="icon-btn ui-btn">' +
								'<img class="icon" name="' + data[i] + '" ' +
										'src=\"img/rooms/' + data[i] + '.png\" ' +
										'width=\"70px\" height=\"70px\" ' +
								'>' +
							'</a>' +
						'</div>');
			}
		}
		
		else if (target.is($("#manual-panel-page .ui-content .smartsets"))) {
			target = target.find('.smartsets-listview');
			target.html("");
			for (let i = 0; i < data.length; i++) {
				let smartset = data[i];
				target.append(
					'<li class="smartset" ' +
							'smartset-id="' + smartset.id + '" ' +
					'>' +
						'<a class="smartset-btn">' +
							app.prettyfy(smartset.name) +
						'</a>' +
						'<a class="edit-smartset-btn" data-icon="edit"></a>' +
					'</li>'
				);
			}
			target.listview("refresh");
		}
		
		else if (target.is($('#manual-panel-page .smartset-popup .smart-items'))) {
			target.html("");
			for (let i = 0; i < data.length; i++) {
				let smartItem = data[i];
				target.append(
						/*'<li class="smart-item" ' +
								'smart-item-id="' + smartItem.id + '" ' +
								'active="' + smartItem.active + '" ' +
						'>' +
							'<a class="smart-item-active-btn ui-btn">' +
								'<img src="img/items/' + smartItem.icon + '.png" ' +
								'width="60px" height="60px">' +
							'</a>' +
							'<div class="smart-item-inner">' +
								'<h2 class="smart-item-name">' +
									app.prettyfy(smartItem.name) +
								'</h2>' +
							'</div>' +
							'<a class="smart-item-remove-btn ' +
									'ui-btn ui-btn-right ' +
									'ui-icon-delete ui-btn-icon-notext"></a>' +
						'</li>');*/
						'<li class="smart-item" ' +
								'smart-item-id="' + smartItem.id + '" ' +
								'active="' + smartItem.active + '" ' +
						'>' +
							'<div class="smart-item-inner">' +
								'<a class="smart-item-active-btn ui-btn">' +
									'<img src="img/items/' + smartItem.icon + '.png"' +
											'width="60px" height="60px"/>' +
								'</a>' +
								'<h2 class="smart-item-name">' + app.prettyfy(smartItem.name) + '</h2>' +
							'</div>' +
							'<ul class="smart-item-controls" ' +
									'data-role="listview" ' +
									'data-inset="true" ' +
							'></ul>' +
							'<a class="smart-item-remove-btn ' +
									'ui-btn ui-btn-right ' +
									'ui-icon-delete ui-btn-icon-notext"></a>' +
						'</li>');
				let $smartItemControls = target.children().last().find('.smart-item-controls');
				for (let smartControl of smartItem.smartControls) {
					switch (smartControl.type) {
					case 'binary':
						$smartItemControls.append(
							'<li class="control control-binary" ' +
									'control-id="' + smartControl.id + '" ' +
									'control-type="' + smartControl.type + '" ' +
							'>' +
								'<div class="ui-field-contain">' +
									'<label>' + app.prettyfy(smartControl.name) + '</label>' +
									'<select class="control-widget" ' +
											'data-role="slider" ' +
											'data-mini="true" ' +
									'>' +
										'<option value="false"></option>' +
										'<option value="true"></option>' +
									'</select>' +
								'</div>' +
							'</li>');
						$smartItemControls.children().last().find('.control-widget').val(
								smartControl.value);
						break;

					case 'linear':
						$smartItemControls.append(
							'<li class="control control-linear" ' +
									'control-id="' + smartControl.id + '" ' +
									'control-type="' + smartControl.type + '" ' +
							'>' +
								'<div class="ui-field-contain">' +
									'<label>' + app.prettyfy(smartControl.name) + '</label>' +
									'<input class="control-widget" ' +
											'type="range" ' +
											'data-highlight="true"' +
											'min="' + smartControl.min + '" ' +
											'max="' + smartControl.max + '" ' +
											'value="' + smartControl.value + '" ' +
									'>' +
								'</div>' +
							'</li>');
						break;

					default:
						console.error('loadTarget::error - type not found');
					}
				}
				//$smartItemControls.enhanceWithin();
				//$smartItemControls.listview('refresh');
			}
			target.enhanceWithin();
			target.listview("refresh");
			//target.enhanceWithin();
		}
		
		else if (target.is($('#manual-panel-page .edit-smartset-popup form'))) {
			target.find('.smartset-name').val(app.prettyfy(app.currentSmartset.name));
		}
		
		else if (target.is($("#manual-panel-page .items"))) {
			target.html("");
			for (let i = 0; i < data.length; i++) {
				let item = data[i];
				target.append(
					'<li class="item" ' +
							'item-id="' + item.id + '" ' +
							'active="' + item.active + '" ' +
					'>' +
						'<div class="item-inner">' +
							'<a class="item-active-btn ui-btn">' +
								'<img src="img/items/' + data[i].icon + '.png"' +
										'width="60px" height="60px"/>' +
							'</a>' +
							'<h2 class="item-name">' + app.prettyfy(item.name) + '</h2>' +
						'</div>' +
						'<ul class="item-controls" ' +
								'data-role="listview" ' +
								'data-inset="true" ' +
						'></ul>' +
						'<a class="item-smart-btn ' +
								'ui-btn ui-btn-right ' +
							'ui-icon-heart ui-btn-icon-notext"></a>' +
					'</li>');
				/*if (item.port == 'none') {
					target.children().last().find('.item-name').append(
							'<a class="warning-btn ui-btn ui-btn-inline ' +
									'ui-icon-alert ui-btn-icon-notext"></a>');
				}*/
			}
			target.listview("refresh");
			target.enhanceWithin();
		}
		
		else if (target.is($('#manual-panel-page .smartsets-panel .smartsets'))) {
			target.html("");
			for (let i = 0; i < data.length; i++) {
				let smartset = data[i];
				target.append(
					'<li class="smartset"' +
							'smartset-id="' + smartset.id + '" ' +
					'>' +
						'<a class="smartset-btn">' +
							'<h3 class="smartset-name">' +
								app.prettyfy(smartset.name) +
							'</h3>' +
						'</a>' +
					'</li>');
			}
			target.listview("refresh");
		}
		
		/*else if (target.is($("#add-item-page .ports")) ||
				target.is($("#edit-item-page .ports"))) {
			let title = target.find('.title-inner');
			target = target.find('.ports-listview');
			target.html("");
			if (app.currentItem != undefined &&
					app.currentItem.port != "none") {
				target.append(
					'<li class="port" data-icon="false">' +
						'<a class="port-btn">' +
							'<h3 class="port-name">' +
								app.prettyfy(app.currentItem.port) +
							'</h3>' +
						'</a>' +
					'</li>');
			}
			target.append(
					'<li class="port" data-icon="false">' +
						'<a class="port-btn">' +
							'<h3 class="port-name">none</h3>' +
						'</a>' +
					'</li>');
			for (let i = 0; i < data.length; i++) {
				let port = data[i];
				target.append(
					'<li class="port" data-icon="false">' +
						'<a class="port-btn">' +
							'<h3 class="port-name">' +
								app.prettyfy(port.name) +
							'</h3>' +
						'</a>' +
					'</li>'
				);
			}
			title.html(target.children().first().find('.port-name').html());
			target.listview("refresh");
		}*/
		else if (target.is($("#edit-item-page .controls"))) {
			target.html('');
			for (let index = 0; index < data.length; index++) {
				let control = data[index];
				target.append(
					'<li class="control" ' +
							'control-id="' + control.id + '" ' +
					'>' +
						'<form>' +
							'<div class="control-options">' +
								'<div class="row-1 ui-grid-a">' +
									'<div class="ui-block-a">' +
										'<input class="control-name" type="text" ' +
												'placeholder="control name" ' +
												'value="' + app.prettyfy(control.name) + '" ' +
										'>' +
									'</div>' +
									'<div class="ui-block-b">' +
									'<a class="remove-control-btn ui-btn ' +
											'ui-icon-delete ui-btn-icon-notext ' +
											//'ui-corner-all ' +
									'">' +
									'</a>' +
									/*'<a class="remove-control-btn ui-btn">' +
										'remove' +
									'</a>' +*/
									'</div>' +
								'</div>' +
								'<div class="row-2 ui-grid-a">' +
									'<div class="ui-block-a">' +
										'<fieldset class="control-type" ' +
												'data-role="controlgroup" ' +
												'data-type="horizontal" ' +
												//'data-mini="true" ' +
										'>' +
											'<input type="radio" ' +
													'class="binary-type-radio" ' +
													'name="control-type" ' +
													'id="element-' + index +
															'-binary-type" ' +
													//'checked="checked" ' +
											'>' +
											'<label class="binary-type-btn" ' +
													'for="element-' + index +
															'-binary-type" ' +
													'value="binary"' +
											'>' +
												'Binary' +
											'</label>' +
											'<input type="radio" ' +
													'class="linear-type-radio" ' +
													'name="control-type" ' +
													'id="element-' + index +
															'-linear-type" ' +
											'>' +
											'<label class="linear-type-btn" ' +
													'for="element-' + index +
															'-linear-type" ' +
													'value="linear"' +
											'>' +
												'Linear' +
											'</label>' +
										'</fieldset>' +
									'</div>' +

									'<div class="ui-block-b">' +
										'<ul class="control-port"' +
												'data-role="listview"' +
												'data-inset="true"' +
												'data-shadow="false" ' +
									'>' +
											'<li class="ports-collapsible"' +
													'data-role="collapsible"' +
													'data-inset="false"' +
													'data-iconpos="right"' +
													'data-collapsed-icon="carat-d"' +
													'data-expanded-icon="carat-u">' +
												'<h2 class="title">' +
													'<div class="title-inner">' +
														app.prettyfy(control.port) +
													'</div>' +
												'</h2>' +

												'<ul class="ports-listview"' +
														'data-role="listview">' +
												'</ul>' +
											'</li>' +
										'</ul>' +
									'</div>' +
								'</div>' +
							'</div>' +

							'<div class="linear-options ui-grid-b">' +
								'<div class="ui-block-a">' +
									'<input class="linear-min" type="number"' +
											'placeholder="min">' +
								'</div>' +
								'<div class="ui-block-b">' +
									'<input type="range" class="linear-slider"' +
											'min="0" max="100" value="50">' +
								'</div>' +
								'<div class="ui-block-c">' +
									'<input class="linear-max" type="number"' +
											'placeholder="max">' +
								'</div>' +
							'</div>' +
						'</form>' +
					'</li>');
				let $control = target.children().last();
				$control.enhanceWithin();
				switch (control.type) {
				case 'binary':
					$control.find('.binary-type-radio').prop("checked", true).checkboxradio("refresh");
					$control.find('.linear-options').addClass('hidden');
					break;
				case 'linear':
					$control.find('.linear-type-radio').prop("checked", true).checkboxradio("refresh");
					$control.find('.linear-min').val(control.min);
					$control.find('.linear-max').val(control.max);
					break;
				default:
					console.error('load::error - control type unknown');
					break;
				}
			}
			target.listview('refresh');
			target.enhanceWithin();
		}
		
		else if (target.is($("#add-item-page .icons")) ||
				target.is($("#edit-item-page .icons"))) {
			target.html("");
			for (let i = 0; i < data.length; i++) {
				target.append(
						'<div class="centered-list-block ui-block-' + app.toBlockType(i % 5) + '">' +
							'<a class="icon-btn ui-btn">' +
								'<img class="icon" name="' + data[i] + '" ' +
										'src=\"img/items/' + data[i] + '.png\" ' +
										'width=\"60px\" height=\"60px\" ' +
								'>' +
							'</a>' +
						'</div>');
			}
		}
		
		else {
			console.log('load::error - target not found');
		}
	},
	
/********** LOAD TARGET *******************************************************/
	
	loadTarget: async function(target, data) {
		if (target.hasClass('ports-collapsible')) {
			let title = target.find('.title-inner');
			let listview = target.find('.ports-listview');
			listview.html("");
			listview.append(
					'<li class="port" data-icon="false">' +
						'<a class="port-btn">' +
							'<h3 class="port-name">' + title.text() + '</h3>' +
						'</a>' +
					'</li>');
			if (title.text() != 'none') {
				listview.append(
					'<li class="port" data-icon="false">' +
						'<a class="port-btn">' +
							'<h3 class="port-name">none</h3>' +
						'</a>' +
					'</li>');
			}
			for (let port of app.extraPorts) {
				if ($.inArray(port, app.selectedPorts) == -1) {
					listview.append(
						'<li class="port" data-icon="false">' +
							'<a class="port-btn">' +
								'<h3 class="port-name">' +
									app.prettyfy(port) +
								'</h3>' +
							'</a>' +
						'</li>'
					);
				}
			}
			for (let port of data) {
				if ($.inArray(port.name, app.selectedPorts) == -1) {
					listview.append(
						'<li class="port" data-icon="false">' +
							'<a class="port-btn">' +
								'<h3 class="port-name">' +
									app.prettyfy(port.name) +
								'</h3>' +
							'</a>' +
						'</li>'
					);
				}
			}
			listview.listview("refresh");
		}
		
		else if (target.hasClass('item-controls')) {
			target.html('');
			for (let control of data) {
				switch (control.type) {
				case 'binary':
					target.append(
						'<li class="control control-binary" ' +
								'control-id="' + control.id + '" ' +
								'control-port="' + control.port + '" ' +
								'control-type="' + control.type + '" ' +
						'>' +
							'<div class="ui-field-contain">' +
								'<label>' + app.prettyfy(control.name) + '</label>' +
								'<select class="control-widget" ' +
										'data-role="slider" ' +
										'data-mini="true" ' +
								'>' +
									'<option value="false"></option>' +
									'<option value="true"></option>' +
								'</select>' +
							'</div>' +
						'</li>');
					target.children().last().find('.control-widget').val(
							control.value)/*.slider('refresh')*/;
					break;
				
				case 'linear':
					target.append(
						'<li class="control control-linear" ' +
								'control-id="' + control.id + '" ' +
								'control-port="' + control.port + '" ' +
								//'control-type="' + control.type + '" ' +
						'>' +
							'<div class="ui-field-contain">' +
								'<label>' + app.prettyfy(control.name) + '</label>' +
								'<input class="control-widget" ' +
										'type="range" ' +
										'data-highlight="true"' +
										//'data-mini="true" ' +
										'min="' + control.min + '" ' +
										'max="' + control.max + '" ' +
										'value="' + control.value + '" ' +
								'>' +
							'</div>' +
						'</li>');
					break;
				
				default:
					console.error('loadTarget::error - type not found');
				}
			}
			target.enhanceWithin();
			target.listview('refresh');
		}
		
		else {
			console.log('loadTarget::error - target not found');
		}
	},
	
	addElement: function(selector) {
		let target = $(selector);
		
		if (target.is($('#sign-in-page .devices'))) {
			target.append(
				'<li class="device" data-icon="info">' +
					'<form>' +
						'<div class="ip-address" data-role="controlgroup" data-type="horizontal">' +
							'<input class="ip-address-a"' +
									'type="number" min="0" max="255"' +
									'data-wrapper-class="controlgroup-textinput ui-btn">' +
							'<input class="ip-address-b"' +
									'type="number" min="0" max="255"' +
									'data-wrapper-class="controlgroup-textinput ui-btn">' +
							'<input class="ip-address-c"' +
									'type="number" min="0" max="255"' +
									'data-wrapper-class="controlgroup-textinput ui-btn">' +
							'<input class="ip-address-d"' +
									'type="number" min="0" max="255"' +
									'data-wrapper-class="controlgroup-textinput ui-btn">' +
						'</div>' +
						//'<a class="check-btn ui-btn ui-btn-inline">check</a>' +
						//'<a class="remove-btn ui-btn ui-btn-inline">remove</a>' +
						//'<h2 class="name"></h2>' +
						'<a class="check-label hidden ui-btn ui-btn-inline ui-icon-check ui-btn-icon-notext"></a>' +
						'<a class="alert-label hidden ui-btn ui-btn-inline ui-icon-alert ui-btn-icon-notext"></a>' +
						'<a class="remove-btn ui-btn ui-btn-inline ui-icon-delete ui-btn-icon-notext"></a>' +
					'</form>' +
				'</li>'
			);
			target.listview('refresh');
			target.enhanceWithin();
		}
		
		else if (target.is($("#add-item-page .controls")) ||
				target.is($("#edit-item-page .controls"))) {
			let index = target.children().size();
			target.append(
				'<li class="control">' +
					'<form>' +
						'<div class="control-options">' +
							'<div class="row-1 ui-grid-a">' +
								'<div class="ui-block-a">' +
									'<input class="control-name" type="text" ' +
											'placeholder="control name" ' +
									'>' +
								'</div>' +
								'<div class="ui-block-b">' +
									'<a class="remove-control-btn ui-btn ' +
											'ui-icon-delete ui-btn-icon-notext ' +
											//'ui-corner-all ' +
									'">' +
									'</a>' +
									/*'<a class="remove-control-btn ui-btn">' +
										'remove' +
									'</a>' +*/
								'</div>' +
							'</div>' +
							'<div class="row-2 ui-grid-a">' +
								'<div class="ui-block-a">' +
									'<fieldset class="control-type" ' +
											'data-role="controlgroup" ' +
											'data-type="horizontal" ' +
											//'data-mini="true" ' +
									'>' +
										'<input type="radio" ' +
												'class="binary-type-radio" ' +
												'name="control-type" ' +
												'id="element-' + index +
														'-binary-type" ' +
												'checked="checked" ' +
										'>' +
										'<label class="binary-type-btn" ' +
												'for="element-' + index +
														'-binary-type" ' +
												'value="binary"' +
										'>' +
											'Binary' +
										'</label>' +
										'<input type="radio" ' +
												'class="linear-type-radio" ' +
												'name="control-type" ' +
												'id="element-' + index +
														'-linear-type" ' +
										'>' +
										'<label class="linear-type-btn" ' +
												'for="element-' + index +
														'-linear-type" ' +
												'value="linear"' +
										'>' +
											'Linear' +
										'</label>' +
									'</fieldset>' +
								'</div>' +

								'<div class="ui-block-b">' +
									'<ul class="control-port"' +
											'data-role="listview"' +
											'data-inset="true"' +
											'data-shadow="false" ' +
								'>' +
										'<li class="ports-collapsible"' +
												'data-role="collapsible"' +
												'data-inset="false"' +
												'data-iconpos="right"' +
												'data-collapsed-icon="carat-d"' +
												'data-expanded-icon="carat-u">' +
											'<h2 class="title">' +
												'<div class="title-inner">' +
													'none' +
												'</div>' +
											'</h2>' +

											'<ul class="ports-listview"' +
													'data-role="listview">' +
											'</ul>' +
										'</li>' +
									'</ul>' +
								'</div>' +
							'</div>' +
							/*'<div class="test-wrapper">' +
								'<div class="test">' +
									'<div class="inside">' +
										'bau' +
									'</div>' +
									'<div class="outside">' +
										'bau bau' +
									'</div>' +
									'<div class="outside">' +
										'bau bau' +
									'</div>' +
									'<div class="outside">' +
										'bau bau' +
									'</div>' +
								'</div>' +
							'</div>' +*/
						'</div>' +

						'<div class="linear-options hidden ui-grid-b">' +
							'<div class="ui-block-a">' +
								'<input class="linear-min" type="number" ' +
										'value="0" placeholder="min">' +
							'</div>' +
							'<div class="ui-block-b">' +
								'<input type="range" class="linear-slider" ' +
										'min="0" max="100" value="50">' +
							'</div>' +
							'<div class="ui-block-c">' +
								'<input class="linear-max" type="number" ' +
										'value="100" placeholder="max">' +
							'</div>' +
						'</div>' +
					'</form>' +
				'</li>');
			target.listview('refresh');
			target.enhanceWithin();
		}
		
		else {
			console.log('addElement::error - target not found');
		}
		
	},
	
	removeElement: function(selector, index) {
		let target = $(selector);
		
		if (target.is($('#add-item-page .controls')) ||
				target.is($('#edit-item-page .controls'))) {
			target.children().eq(index).remove();
			target.children().each(function() {
				//alert($(this).find('.binary-type-radio').attr('id'));
				//alert($(this).find('.linear-type-radio').attr('id'));
				$(this).find('.binary-type-radio').attr(
						'id', 'element-' + $(this).index() + '-binary-type');
				$(this).find('.binary-type-btn').attr(
						'for', 'element-' + $(this).index() + '-binary-type');
				$(this).find('.linear-type-radio').attr(
						'id', 'element-' + $(this).index() + '-linear-type');
				$(this).find('.linear-type-btn').attr(
						'for', 'element-' + $(this).index() + '-linear-type');
			});
		}
		
		else {
			console.log('removeElement::error - target not found');
		}
	},
	
	refreshActivateSmartsetPanel: function() {
		app.arduino.getSmartsets(
				app.currentRoom,
				app.currentProfile,
				app.currentRoom.device.ip_address)
		.then(function(result) {
			var response = JSON.parse(result);

			if (response.outcome == "success") {
				app.loadActivateSmartsetPanel(response.smartsets);
			}
			else {
				alert(response.error);
			}
		})
		.catch(function() {
			alert("getSmartsets::error");
		});
	},
	
	loadActivateSmartsetPanel: function(smartsets) {
		var container = $("#control-panel-page .smartsets-list");
		container.html("");
		
		for (let index = 0; index < smartsets.length; index++) {
			let smartset = smartsets[index];
			let prettifiedName = app.prettyfy(smartset.name);
			container.append(
				'<li ' +
					'class="smartset" ' +
					'id="' + smartset.id + '" ' +
				'>' +
					'<a class="activate-btn">' + prettifiedName + '</a>' +
				'</li>'
			);
		}
		container.listview( "refresh" );
		
		/*if (container.html() == "") {
			container.html("<p>There aren't any smartsets yet</p>");
		}*/
	},
	
	loadSmartsetsList: function(smartsets) {
		var container = $("#smartsets-page .smartsets-list");
		container.html("");
		
		for (let index = 0; index < smartsets.length; index++) {
			let smartset = smartsets[index];
			let prettifiedName = app.prettyfy(smartset.name);
			container.append(
				'<li ' +
					'class="smartset" ' +
					'id="' + smartset.id + '" ' +
				'>' +
					'<a class="open-btn">' + prettifiedName + '</a>' +
					'<a class="edit-btn"></a>' +
				'</li>'
			);
		}
		container.listview( "refresh" );
		
		/*if (container.html() == "") {
			container.html("<p>There aren't any smartsets yet</p>");
		}*/
	},
	
	refreshSmartsetsPanel: function() {
		app.arduino.getSmartsets(
				app.currentRoom,
				app.currentProfile,
				app.currentRoom.device.ip_address)
		.then(function(result) {
			var response = JSON.parse(result);

			if (response.outcome == "success") {
				app.loadSmartsets(response.smartsets);
			}
			else {
				alert(response.error);
			}
		})
		.catch(function() {
			alert("getSmartsets::error");
		});
	},
	
	loadSmartsets: function(smartsets) {
		var container = $("#manual-panel-page .smartsets-list");
		container.html("");
		
		for (let index = 0; index < smartsets.length; index++) {
			let smartset = smartsets[index];
			let prettifiedName = app.prettyfy(smartset.name);
			container.append(
				'<li ' +
					'class="smartset" ' +
					'id="' + smartset.id + '" ' +
				'>' +
					'<a>' + prettifiedName + '</a>' +
				'</li>'
			);
		}
		container.listview( "refresh" );
		
		/*if (container.html() == "") {
			container.html("<p>There aren't any smartsets yet</p>");
		}*/
	},
	
	loadSmartItems: function(smartItems) {
		var container = $("#smart-items-page .smart-items-list");
		container.html("");
		
		for (let index = 0; index < smartItems.length; index++) {
			let smartItem = smartItems[index];
			container.append(
				'<li ' +
					'class="smart-item" ' +
					'id="' + smartItem.id + '" ' +
					'active="' + smartItem.active + '" ' +
				'>' +
					'<a class="active-btn">' +
						smartItem.id + ' : ' + smartItem.active +
					'</a>' +
					'<a class="delete-btn"></a>' +
				'</li>'
			);
		}
		container.listview( "refresh" );
		
		/*if (container.html() == "") {
			container.html("<p>There aren't any smartsets yet</p>");
		}*/
	},
	
	/*refreshPorts: function(ports) {
		var container = $("select.port-select");
		container.html("");
		
		if (app.currentItem != undefined &&
				app.currentItem.port != "none") {
			let portName = app.currentItem.port;
			container.append(
				"<option value=\"" + portName + "\">" +
				app.prettyfy(portName) + "</option>");
		}
		
		container.append("<option value=\"none\">none</option>");
		
		for (let index = 0; index < ports.length; index++) {
			let portName = ports[index].name;
			container.append(
				"<option value=\"" + portName + "\">" +
				app.prettyfy(portName) + "</option>");
		}
		
		if (container.html() != "") {
			container.prop("disabled", false);
		}
		else {
			container.prop("disabled", true);
		}
		
		container.selectmenu().selectmenu("refresh");
		container.enhanceWithin();
	},*/
	
	cleanupEditProfilePage: function() {
		$("#edit-profile-page input[name=\"name\"]").val("");
		$("#edit-profile-page input[name=\"avatars\"]")
			.prop("checked", false)
			.checkboxradio("refresh");
	},
	
	cleanupAddProfilePage: function() {
		$("#add-profile-page input[name=\"name\"]").val("");
		$("#add-profile-page input[name=\"avatars\"]")
			.prop("checked", false)
			.checkboxradio("refresh");
	},
	
	cleanupEditRoomPage: function() {
		$("#edit-room-page input[name=\"name\"]").val("");
		$("#edit-room-page input[name=\"room-icons\"]")
			.prop("checked", false)
			.checkboxradio("refresh");
	},
	
	cleanupAddRoomPage: function() {
		$("#add-room-page input[name=\"name\"]").val("");
		$("#add-room-page input[name=\"room-icons\"]")
			.prop("checked", false)
			.checkboxradio("refresh");
	},
	
	cleanupEditItemPage: function() {
		$("#edit-item-page input[name=\"name\"]").val("");
		$("#edit-item-page input[name=\"port\"]").val("");
		$("#edit-item-page input[name=\"item-icons\"]")
			.prop("checked", false)
			.checkboxradio("refresh");
	},
	
	cleanupAddItemPage: function() {
		$("#add-item-page input[name=\"name\"]").val("");
		$("#add-item-page input[name=\"port\"]").val("");
		$("#add-item-page input[name=\"item-icons\"]")
			.prop("checked", false)
			.checkboxradio("refresh");
	},
	
	setEditProfilesMode: function(value) {
		if (value) {
			$("#profiles-page .profile-avatar").addClass('obscured');
			$("#profiles-page .profile-btn").addClass('ui-icon-edit ui-btn-icon-top');
		}
		else {
			$("#profiles-page .profile-avatar").removeClass('obscured');
			$("#profiles-page .profile-btn").removeClass('ui-icon-edit ui-btn-icon-top');
		}
		app.editProfilesMode = value;
	},
	
	setEditRoomsMode: function(value) {
		if (value) {
			//$("#control-panel-page .room-smart-btn").addClass('obscured');
			$("#control-panel-page .room-smart-btn").addClass('ui-icon-edit ui-btn-icon-left');
		}
		else {
			//$("#control-panel-page .room-smart-btn").removeClass('obscured');
			$("#control-panel-page .room-smart-btn").removeClass('ui-icon-edit ui-btn-icon-left');
		}
		app.editRoomsMode = value;
	},
	
	setEditItemsMode: function(value) {
		if (value) {
			$("#manual-panel-page .item-active-btn").addClass('ui-icon-edit ui-btn-icon-left');
		}
		else {
			$("#manual-panel-page .item-active-btn").removeClass('ui-icon-edit ui-btn-icon-left');
		}
		app.editItemsMode = value;
	},
	
	onLeave: function(page) {
		switch(page) {
		
		case "#add-profile-page":
			/*$('#add-profile-page .profile-avatar').attr(
					'src',
					app.profileAvatarsPath + app.defaultProfileAvatar + '.png');
			$('#add-profile-page .profile-name').val('');*/
			break;
		
		case "#edit-profile-page":
			/*app.currentProfile = undefined;
			$('#edit-profile-page .profile-avatar').attr(
					'src',
					app.profileAvatarsPath + app.defaultProfileAvatar + '.png');
			$('#edit-profile-page .profile-name').val('');*/
			break;
			
		case "#add-room-page":
			/*$('#add-room-page .room-icon').attr(
					'src',
					app.roomIconsPath + app.defaultRoomIcon + '.png');
			$('#add-room-page .room-name').val('');*/
			break;
		
		case "#edit-room-page":
			/*app.currentRoom = undefined;
			$('#edit-room-page .room-icon').attr(
					'src',
					app.roomIconsPath + app.defaultRoomIcon + '.png');
			$('#edit-room-page .room-name').val('');*/
			break;
		
		case "#add-item-page":
			break;
		
		case "#edit-item-page":
			break;
		
		default:
			
		}
	},
	
	changePage: function(page) {
		//$.mobile.navigate(destination);
		
		switch(page) {
				
		/*case "#sign-in-page":
		case "#registerPage":
			app.refreshDevices();
			break;*/
				
		case "#profiles-page":
			/*if (app.editProfilesMode) {
				app.setEditProfilesMode(false);
			}
			
			app.refreshProfilesList();*/
			break;
				
		case "#add-profile-page":
			/*$('#add-profile-page .profile-avatar').attr(
					'name',
					app.profileAvatars[0]);
			$('#add-profile-page .profile-avatar').attr(
					'src',
					'img/profiles/' + app.profileAvatars[0] + '.png');
			app.load('#add-profile-page .avatars', app.profileAvatars);*/
			break;
				
		case '#edit-profile-page':
			/*$('#edit-profile-page .profile-avatar').attr(
					'name',
					app.currentProfile.avatar);
			$('#edit-profile-page .profile-avatar').attr(
					'src',
					'img/profiles/' + app.currentProfile.avatar + '.png');
			$('#edit-profile-page .profile-name').val(
					app.currentProfile.name);
			app.load('#edit-profile-page .avatars', app.profileAvatars);*/
			break;
				
		case "#sign-in-profile-page":
			/*app.refreshProfileInfo(app.currentProfile);*/
			break;
				
		case "#control-panel-page":
			/*if (app.editRoomsMode) {
				app.setEditRoomsMode(false);
			}
			app.refresh('#control-panel-page .rooms');*/
			break;
				
		case "#add-room-page":
			/*$('#add-room-page .room-icon').attr(
					'name',
					app.roomIcons[16]);
			$('#add-room-page .room-icon').attr(
					'src',
					'img/rooms/' + app.roomIcons[16] + '.png');
			app.load('#add-room-page .icons', app.roomIcons);*/
			break;
				
		case '#edit-room-page':
			/*$('#edit-room-page .room-icon').attr(
					'name',
					app.currentRoom.icon);
			$('#edit-room-page .room-icon').attr(
					'src',
					'img/rooms/' + app.currentRoom.icon + '.png');
			$('#edit-room-page .room-name').val(
					app.currentRoom.name);
			app.load('#edit-room-page .icons', app.roomIcons);*/
			break;
				
		case "#manual-panel-page":
			/*if (app.editItemsMode)
				app.setEditItemsMode(false);
				
			app.arduino.getItems(
					app.currentRoom.id,
					app.currentProfile.id)
			.then(function(result) {
				var response = JSON.parse(result);
				
				if (response.outcome == "success") {
					app.refresh('#manual-panel-page .items');
				}
				else {
					alert(response.error);
				}
			})
			.catch(function() {
				alert("getItems::error");
			});*/
				
			//app.refresh('#manual-panel-page .smartsets');
			break;
				
		case "#add-item-page":
			/*$('#add-item-page .item-icon').attr(
					'name',
					app.itemIcons[10]);
			$('#add-item-page .item-icon').attr(
					'src',
					'img/items/' + app.itemIcons[10] + '.png');
			app.refresh('#add-item-page .ports');
			app.load('#add-item-page .icons', app.itemIcons);*/
			break;
				
		case "#edit-item-page":
			/*$('#edit-item-page .item-icon').attr(
					'name',
					app.currentItem.icon);
			$('#edit-item-page .item-icon').attr(
					'src',
					'img/items/' + app.currentItem.icon + '.png');
			$('#edit-item-page .item-name').val(
					app.currentItem.name);
			app.refresh('#edit-item-page .ports');
			app.load('#edit-item-page .icons', app.itemIcons);*/
			break;
			
		/*case "#smartsets-page":
			app.arduino.getSmartsets(app.currentRoom, app.currentProfile)
			.then(function(result) {
				var response = JSON.parse(result);
				
				if (response.outcome == "success") {
					app.loadSmartsetsList(response.smartsets);
				}
				else {
					alert(response.error);
				}
			})
			.catch(function() {
				alert("getSmartsets::error");
			});
			break;
				
		case "#edit-smartset-page":
			$("#edit-smartset-page input[name=\"name\"]").val(app.prettyfy(
					app.currentSmartset.name));
			break;
			
		case "#smart-items-page":
			app.arduino.getSmartItems(
					app.currentProfile,
					app.currentRoom,
					app.currentSmartset)
			.then(function(result) {
				var response = JSON.parse(result);
				
				if (response.outcome == "success") {
					app.loadSmartItems(response.smart_items);
				}
				else {
					alert(response.error);
				}
			})
			.catch(function() {
				alert("getSmartItems::error");
			});
			break;*/
		default:
		}
		
		$.mobile.navigate(page);
	},
	
	// Create the XHR object.
	createCORSRequest: function(method, url) {
		var xhr = new XMLHttpRequest();
		if (typeof (xhr.withCredentials) !== "undefined") {
			// XHR for Chrome/Firefox/Opera/Safari.
			xhr.open(method, url, true);
		} else if (typeof XDomainRequest !== "undefined") {
			// XDomainRequest for IE.
			xhr = new XDomainRequest();
			xhr.open(method, url);
		} else {
			// CORS not supported.
			xhr = null;
		}
		return xhr;
	},
	
	prettyfy: function(string) {
		return string.replace(/_/g, " ");
	},
	
	dePrettyfy: function(string) {
		return string.replace(/ /g, "_");
	},
	
	toBlockType: function(number) {
		return String.fromCharCode('a'.charCodeAt(0) + number);
	},
	
	findSmartset: function(profileId, smartsets) {
		for (let i = 0; i < smartsets.length; i++) {
			if (smartsets[i].owner_id == profileId) {
				return smartsets[i];
			}
		}
		return undefined;
	},
	
	
/********** ARDUINO ***********************************************************/
	
	arduino: {
		
		/*searchDevices: function() {
			var networkAddress =
					$("#sign-in-page .local-ip-1").val() + "." +
					$("#sign-in-page .local-ip-2").val() + "." +
					$("#sign-in-page .local-ip-3").val() + ".";
			
			//for (var hostAddress = 1; hostAddress < 254; hostAddress++) {
			for (var hostAddress = app.debugHost; hostAddress < app.debugHost + 1; hostAddress++) {
				//alert(protocol + "://" + networkAddress + hostAddress);
				
				let xhr = app.createCORSRequest(
						"GET", "http://" + networkAddress + hostAddress);
				
				if (!xhr) {
					alert("CORS not supported");
					break;
				}
				
				// response handlers
				xhr.onload = function () {
					var response = xhr.responseText;
					var title = response.match(/<title>([^<]*)/)[1];

					if (title == "Smart Home") {
						var name = response.match(/ID: ([^<]*)/)[1];
						var address = response.match(/IP address: ([^<]*)/)[1];
						var found = false;
						
						for (var index = 0;
							index < app.availableDevices.length;
							index++) {
							var currentDevice = app.availableDevices[index];
							if (currentDevice.address == address) {
								found = true;
								// overwrite
								currentDevice.name = name;
							}
						}
						if (!found) {
							app.availableDevices.push({
								"name" : name,
								"address" : address,});
							app.refreshDevicesContainer();
						}
					}
				};
				xhr.onerror = function () {};

				xhr.send();
			}
		},*/
		
		request: function(method, url, data) {
			if (data) {
				return new Promise((resolve, reject) => {
					return $.ajax({
						type: method,
						url: url,
						data: data + "\n\n",
						success: resolve,
						error: reject,
						timeout: 5000,
					});
				});
			}
			else {
				return new Promise((resolve, reject) => {
					return $.ajax({
						type: method,
						url: url,
						success: resolve,
						error: reject,
						timeout: 5000,
					});
				});
			}
		},
		
		getDeviceInfo: function(deviceIp) {
			return app.arduino.request(
					"GET",
					"http://" + deviceIp + "/info/");
		},
		
		/*getDevices: async function() {
			var networkAddress =
					$("#sign-in-page .local-ip-1").val() + "." +
					$("#sign-in-page .local-ip-2").val() + "." +
					$("#sign-in-page .local-ip-3").val();
			let devices = [];
			let promises = [];
			//for (var hostAddress = 1; hostAddress < 254; hostAddress++) {
			// DEBUG
			for (let hostAddress = app.debugHost; hostAddress < app.debugHost + 1; hostAddress++) {
				let address = networkAddress + '.' + hostAddress;
				console.log(address);
				promises.push(app.arduino.getDeviceInfo(address));
			}
			let successes = 0;
			let failures = 0;
			let outcome;
			//let results = await Promise.all(promises);
			
			console.log(promises.length);
			let tmp1 = 0;
			let tmp2 = 0;
			for (let promise of promises) {
				if (promise == undefined) {
					console.log('this promise is undefined');
				}
				try {
					tmp1++;
					let response = JSON.parse(await promise);
					tmp2++;
					if (response.outcome != undefined) {
						if (response.outcome == 'success') {
							successes++;
							devices.push(response.device_info);
						}
						else {
							failures++;
							console.error(response.error);
						}
					}
				}
				catch (error) {
					continue;
				}
			}
			console.log(tmp1);
			console.log(tmp2);
			if (successes == 0) {
				outcome = 'failure';
			}
			else if (failures == 0) {
				outcome = 'success';
			}
			else {
				outcome = 'partial_success';
			}
			return {
				outcome: outcome,
				devices: devices,
			};
		},*/
		
		updateProfiles: function(profiles, deviceIp) {
			return app.arduino.request(
					"POST",
					"http://" + deviceIp + "/profiles/" +
							"?action=update",
					JSON.stringify({
						"action": "update",
						"profiles": profiles,
					}));
		},
		
		coopGetProfiles: async function() {
			let profiles = [];
			let requests = [];
			let responses = [];
			for (let device of app.connectedDevices) {
				requests.push(app.arduino.getProfiles(device.ip_address));
			}
			for (let request of requests) {
				try {
					responses.push(JSON.parse(await request));
				}
				catch (error) {
					console.log('getProfiles::no_reach');
				}
			}
			for (let response of responses) {
				if (response.outcome == 'success') {
					for (let targetProfile of response.profiles) {
						let found = false;
						for (let profile of profiles) {
							if (targetProfile.id == profile.id) {
								found = true;
								if (parseInt(targetProfile.last_edit, 10) >
										parseInt(profile.last_edit, 10)) {
									profile = targetProfile;
								}
							}
						}
						if (!found) {
							profiles.push(targetProfile);
						}
					}
				}
				else {
					console.log(response.error);
				}
			}
			
			requests = [];
			responses = [];
			for (let device of app.connectedDevices) {
				requests.push(app.arduino.updateProfiles(
						profiles,
						device.ip_address));
			}
			for (let request of requests) {
				try {
					responses.push(JSON.parse(await request));
				}
				catch (error) {
					console.log('updateProfiles::no_reach');
				}
			}
			for (let response of responses) {
				if (response.outcome == 'failure') {
					console.log(response.error);
				}
			}
			
			return {
				outcome: 'success',
				profiles: profiles,
			};
		},
		
		getProfiles: function(deviceIp) {
			return app.arduino.request(
					"GET",
					"http://" + deviceIp + "/profiles/");
		},
		
		coopGetProfile: async function(profileId) {
			let profile = undefined;
			let requests = [];
			let responses = [];
			for (let device of app.connectedDevices) {
				requests.push(app.arduino.getProfile(profileId, device.ip_address));
			}
			for (let request of requests) {
				try {
					responses.push(JSON.parse(await request));
				}
				catch (error) {
					console.log('getProfile::no_reach');
				}
			}
			for (let response of responses) {
				if (response.outcome == 'success') {
					if (profile == undefined ||
							parseInt(response.profile.last_edit, 10) >
							parseInt(profile.last_edit, 10)) {
						profile = response.profile;
					}
				}
				else {
					console.log(response.error);
				}
			}
			
			// TODO: uncomment the following code to update single profiles too
			
			/*requests = [];
			responses = [];
			for (let device of app.connectedDevices) {
				requests.push(app.arduino.updateProfile(
						profile,
						device.ip_address));
			}
			for (let request of requests) {
				try {
					responses.push(JSON.parse(await request));
				}
				catch (error) {
					console.log('updateProfile::no_reach');
				}
			}
			for (let response of responses) {
				if (response.outcome == 'failure') {
					console.log(response.error);
				}
			}*/
			
			return {
				outcome: 'success',
				profile: profile,
			};
		},
		
		getProfile: function(profileId, deviceIp) {
			return app.arduino.request(
					"GET",
					"http://" + deviceIp + "/profiles/" + profileId);
		},
		
		coopGetRooms: async function(profileId) {
			let rooms = [];
			let requests = [];
			let responses = [];
			for (let device of app.connectedDevices) {
				requests.push(app.arduino.getRooms(
						profileId,
						device.ip_address));
			}
			for (let request of requests) {
				try {
					responses.push(JSON.parse(await request));
				}
				catch (error) {
					console.log('getRooms::no_reach');
				}
			}
			let outcome = 'failure';
			for (let response of responses) {
				if (response.outcome == 'success') {
					outcome = response.outcome;
					let localData = {
						device: response.device,
						localRooms: response.rooms,
					};
					rooms.push(localData);
				}
				else {
					console.log(response.error);
				}
			}
			
			return {
				outcome: outcome,
				rooms: rooms,
			};
		},
		
		getRooms: function(profileId, deviceIp) {
			return app.arduino.request(
					"GET",
					"http://" + deviceIp + "/rooms/",
					"profile_id=" + profileId);
		},
		
		getRoom: function(roomId, profileId, deviceIp) {
			return app.arduino.request(
					"GET",
					"http://" + deviceIp + "/rooms/" + roomId,
					"profile_id=" + profileId);
		},
		
		getItems: function(roomId, profileId, deviceIp) {
			return app.arduino.request(
					"GET",
					"http://" + deviceIp + "/items/",
					"room_id=" + roomId + "&" +
							"profile_id=" + profileId);
		},
		
		getItem: function(itemId, room, profile, deviceIp) {
			return app.arduino.request(
					"GET",
					"http://" + deviceIp + "/items/" + itemId,
					"room_id=" + room.id + "&" +
							"profile_id=" + profile.id);
		},
		
		getControls: function(itemId, roomId, profileId, deviceIp) {
			return app.arduino.request(
					"GET",
					"http://" + deviceIp + "/controls/",
					"item_id=" + itemId + "&" +
							"room_id=" + roomId + "&" +
							"profile_id=" + profileId);
		},
		
		getControl: function(controlName, itemId, roomId, profileId, deviceIp) {
			return app.arduino.request(
					"GET",
					"http://" + deviceIp + "/controls/" + controlName,
					"item_id=" + itemId + "&" +
							"room_id=" + roomId + "&" +
							"profile_id=" + profileId);
		},
		
		getSmartsets: function(room, profile, deviceIp) {
			return app.arduino.request(
					"GET",
					"http://" + deviceIp + "/smartsets/",
					"profile_id=" + profile.id + "&" +
							"room_id=" + room.id + "&" +
							"item_id=" + 'null');
		},
		
		getActiveSmartsets: function(roomId, deviceIp) {
			return app.arduino.request(
					"GET",
					"http://" + deviceIp + "/active_smartsets/",
					"room_id=" + roomId);
		},
		
		getSmartset: function(smartset_id, profile, room, deviceIp) {
			return app.arduino.request(
					"GET",
					"http://" + deviceIp + "/smartsets/" + smartset_id,
					"profile_id=" + profile.id + "&" +
							"room_id=" + room.id);
		},
		
		/*getSmartsetByName: function(smartset_name, room, profile) {
			return app.arduino.request(
					"GET",
					"http://" + app.connectedDevice.address +
							"/smartsets/",
					"smartset_name=" + smartset_name + "&" +
							"room_id=" + room.id + "&" +
							"profile_id=" + profile.id + "&");
		},*/
		
		getSmartItems: function(smartsetId, roomId, profileId, deviceIp) {
			return app.arduino.request(
					"GET",
					"http://" + deviceIp + "/smart_items/",
					"profile_id=" + profileId + "&" +
							"room_id=" + roomId + "&" +
							"smartset_id=" + smartsetId);
		},
		
		getSmartItem: function(smartItemId, profile, room, smartset, deviceIp) {
			return app.arduino.request(
					"GET",
					"http://" + deviceIp + "/smart_items/" + smartItemId,
					"profile_id=" + profile.id + "&" +
							"room_id=" + room.id + "&" +
							"smartset_id=" + smartset.id);
		},
		
		getSmartControls: function(smartItemId, smartsetId, roomId, profileId, deviceIp) {
			return app.arduino.request(
					"GET",
					"http://" + deviceIp + "/smart_controls/",
					"profile_id=" + profileId + "&" +
							"room_id=" + roomId + "&" +
							"smartset_id=" + smartsetId + "&" +
							"smart_item_id=" + smartItemId);
		},
		
		getPorts: function(deviceIp) {
			return app.arduino.request(
					"GET",
					"http://" + deviceIp + "/ports/");
		},
		
		coopAddProfile: async function(newProfile) {
			let requests = [];
			let responses = [];
			for (let device of app.connectedDevices) {
				requests.push(app.arduino.addProfile(
						newProfile,
						device.ip_address));
			}
			for (let request of requests) {
				try {
					responses.push(JSON.parse(await request));
				}
				catch (error) {
					console.log('addProfile::no_reach');
				}
			}
			let outcome = 'failure';
			let profileId = undefined;
			for (let response of responses) {
				if (response.outcome == 'success') {
					outcome = response.outcome;
					if (profileId == undefined) {
						profileId = response.profile_id;
					}
				}
				else {
					console.log(response.error);
				}
			}
			
			return {
				outcome: outcome,
				profile_id: profileId,
			};
		},
		
		addProfile: function(newProfile, deviceIp) {
			return app.arduino.request(
					"POST",
					"http://" + deviceIp + "/profiles/?action=add",
					JSON.stringify({
						"action": "add",
						"new_profile": newProfile,
					}));
		},
		
		addRoom: function(newRoom, deviceIp) {
			return app.arduino.request(
					"POST",
					"http://" + deviceIp + "/rooms/" + "?action=add",
					JSON.stringify({
						"action": "add",
						"new_room": newRoom,
					}));
		},
		
		addItem: function(newItem, room, deviceIp) {
			return app.arduino.request(
					"POST",
					"http://" + deviceIp + "/items/" + "?action=add",
					JSON.stringify({
						"action": "add",
						"new_item": newItem,
						"room_id": room.id,
					}));
		},
		
		addSmartset: function(newSmartset, roomId, profileId, deviceIp) {
			return app.arduino.request(
					"POST",
					"http://" + deviceIp + "/smartsets/" + "?action=add",
					JSON.stringify({
						action: "add",
						new_smartset: newSmartset,
						room_id: roomId,
						profile_id: profileId,
					}));
		},
		
		coopEditProfile: async function(profile, newProfile) {
			let requests = [];
			let responses = [];
			for (let device of app.connectedDevices) {
				requests.push(app.arduino.editProfile(
						profile,
						newProfile,
						device.ip_address));
			}
			for (let request of requests) {
				try {
					responses.push(JSON.parse(await request));
				}
				catch (error) {
					console.log('editProfile::no_reach');
				}
			}
			let outcome = 'failure';
			for (let response of responses) {
				if (response.outcome == 'success') {
					outcome = response.outcome;
				}
				else {
					console.log(response.error);
				}
			}
			
			return {
				outcome: outcome,
			};
		},
		
		editProfile: function(profile, newProfile, deviceIp) {
			return app.arduino.request(
					"POST",
					"http://" + deviceIp + "/profiles/" + profile.id +
							"?action=edit",
					JSON.stringify({
						"action": "edit",
						"profile_id": profile.id,
						"new_profile": newProfile,
					}));
		},
		
		editRoom: function(room, newRoom, deviceIp) {
			return app.arduino.request(
					"POST",
					"http://" + deviceIp + "/rooms/" + room.id + "?action=edit",
					JSON.stringify({
						"action": "edit",
						"room_id": room.id,
						"new_room": newRoom,
					}));
		},
		
		editItem: function(item, itemId, roomId, profileId, deviceIp) {
			return app.arduino.request(
					"POST",
					"http://" + deviceIp + "/items/" + itemId + "?action=edit",
					JSON.stringify({
						"action": "edit",
						"item": item,
						"item_id": itemId,
						"room_id": roomId,
						"profile_id": profileId,
					}));
		},
		
		editSmartset: function(smartsetId, newSmartset, roomId, profileId, deviceIp) {
			return app.arduino.request(
					"POST",
					"http://" + deviceIp + "/smartsets/" + smartsetId + "?action=edit",
					JSON.stringify({
						"action": "edit",
						"smartset_id": smartsetId,
						"new_smartset": newSmartset,
						"room_id": roomId,
						"profile_id": profileId,
					}));
		},
		
		coopRemoveProfile: async function(profile) {
			let requests = [];
			let responses = [];
			for (let device of app.connectedDevices) {
				requests.push(app.arduino.removeProfile(
						profile,
						device.ip_address));
			}
			for (let request of requests) {
				try {
					responses.push(JSON.parse(await request));
				}
				catch (error) {
					console.log('removeProfile::no_reach');
				}
			}
			let outcome = 'failure';
			for (let response of responses) {
				if (response.outcome == 'success') {
					outcome = response.outcome;
				}
				else {
					console.log(response.error);
				}
			}
			
			return {
				outcome: outcome,
			};
		},
		
		removeProfile: function(profile, deviceIp) {
			return app.arduino.request(
					"POST",
					"http://" + deviceIp + "/profiles/" + profile.id +
							"?action=remove",
					JSON.stringify({
						"action": "remove",
						"profile_id": profile.id,
					}));
		},
		
		removeRoom: function(room, deviceIp) {
			return app.arduino.request(
					"POST",
					"http://" + deviceIp + "/rooms/" + room.id + "?action=remove",
					JSON.stringify({
						"action": "remove",
						"room_id": room.id,
					}));
		},
		
		removeItem: function(item, room, deviceIp) {
			return app.arduino.request(
					"POST",
					"http://" + deviceIp + "/items/" + item.id + "?action=remove",
					JSON.stringify({
						"action": "remove",
						"item_id": item.id,
						"room_id": room.id,
					}));
		},
		
		removeSmartset: function(smartsetId, roomId, profileId, deviceIp) {
			return app.arduino.request(
					"POST",
					"http://" + deviceIp + "/smartsets/" + smartsetId + "?action=remove",
					JSON.stringify({
						"action": "remove",
						"room_id": roomId,
						"profile_id": profileId,
					}));
		},
		
		setItemActive: function(itemId, itemActive, room, deviceIp) {
			return app.arduino.request(
					"POST",
					"http://" + deviceIp + "/items/" + itemId + "?action=set_active",
					JSON.stringify({
						action: "set_active",
						item_id: itemId,
						item_active: itemActive,
						room_id: room.id,
					}));
		},
		
		setSmartItemActive: function(smartItemActive, smartItemId, smartsetId, smartRoomId, profileId, deviceIp) {
			return app.arduino.request(
					"POST",
					"http://" + deviceIp + "/smart_items/" + smartItemId + "?action=set_active",
					JSON.stringify({
						action: "set_active",
						smart_item_active: smartItemActive,
						smart_item_id: smartItemId,
						smartset_id: smartsetId,
						smart_room_id: smartRoomId,
						profile_id: profileId,
					}));
		},
		
		setControlStatus: function(status, controlId, itemId, roomId, profileId, deviceIp) {
			return app.arduino.request(
					"POST",
					"http://" + deviceIp + "/controls/" + controlId + "?action=set_status",
					JSON.stringify({
						action: "set_status",
						control_status: status,
						control_id: controlId,
						item_id: itemId,
						room_id: roomId,
						profile_id: profileId,
					}));
		},
		
		setSmartControlStatus: function(smartControl, smartControlId, smartItemId, smartsetId, smartRoomId, profileId, deviceIp) {
			return app.arduino.request(
					"POST",
					"http://" + deviceIp + "/smart_controls/" + smartControlId + "?action=set_status",
					JSON.stringify({
						action: "set_status",
						smart_control: smartControl,
						smart_control_id: smartControlId,
						smart_item_id: smartItemId,
						smartset_id: smartsetId,
						smart_room_id: smartRoomId,
						profile_id: profileId,
					}));
		},
		
		addItemToSmartset: function(smartset_id, item, roomId, profileId, deviceIp) {
			return app.arduino.request(
					"POST",
					"http://" + deviceIp + "/smartsets/" + smartset_id + "?action=add_item",
					JSON.stringify({
						action: "add_item",
						item : item,
						room_id : roomId,
						profile_id : profileId,
					}));
		},
		
		removeItemFromSmartset: function(itemId, smartsetId, roomId, profileId, deviceIp) {
			return app.arduino.request(
					"POST",
					"http://" + deviceIp + "/smartsets/" + smartsetId + "?action=remove_item",
					JSON.stringify({
						"action": "remove_item",
						item_id : itemId,
						room_id : roomId,
						profile_id : profileId,
					}));
		},
		
		activateSmartset: function(smartsetId, room, profile, deviceIp) {
			return app.arduino.request(
					"POST",
					"http://" + deviceIp + "/rooms/" + room.id + "?action=activate_smartset",
					JSON.stringify({
						"action": "activate_smartset",
						smartset_id : smartsetId,
						room_id : room.id,
						profile_id : profile.id,
					}));
		},
		
		deactivateSmartset: function(smartsetId, roomId, profileId, deviceIp) {
			return app.arduino.request(
					"POST",
					"http://" + deviceIp + "/rooms/" + roomId + "?action=deactivate_smartset",
					JSON.stringify({
						action: "deactivate_smartset",
						smartset_id : smartsetId,
						room_id : roomId,
						profile_id : profileId,
					}));
		},
	},
};