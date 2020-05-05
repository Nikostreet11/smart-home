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
	availableDevices: [],
	connectedDevice: undefined,
	//activeUser: undefined,
	currentProfile: undefined,
	currentRoom: undefined,
	currentItem: undefined,
	currentSmartset: undefined,
	editProfilesMode: false,
	editRoomsMode: false,
	editItemsMode: false,
	profileAvatars: ["avatar-0", "avatar-1", "avatar-2", "avatar-3", "avatar-4",
		"avatar-5", "avatar-6", "avatar-7", "avatar-8", "avatar-9", "avatar-10",
		"avatar-11",],
	roomIcons: ["001-bath", "002-bed", "003-bench", "004-bedside-table",
		"005-book-shelf", "006-book-shelf-1", "007-cabinet", "008-cradle",
		"009-chair", "010-chair-1", "011-chair-2", "012-closet",
		"013-coffee-table", "014-desk", "015-desktop", "016-picture",
		"017-furniture", "018-living-room", "019-hanger", "020-kitchen-set",
		"021-kitchen", "022-kitchen-table", "023-kitchen-1",
		"024-kitchen-table-1", "025-lamp", "026-nightstand", "027-nightstand-1",
		"028-office-chair", "029-rocking-chair", "030-shelf", "031-sofa",
		"032-chair-3", "033-stool", "034-television", "035-bunk", "036-sink",],
	ITEM_ICONS: ["001-wifi", "002-thermometer", "003-refrigerator", "004-lamp",
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
	clickManager: {
		timerId: null,
		active: false,
	},
	// DEBUG
	debugHost: 8,
	//--------------------

	
	initialize: function() {
		/*app.refreshAvatars(app.AVATARS);*/
		/*app.refreshRoomIcons(app.ROOM_ICONS);*/
		app.refreshItemIcons(app.ITEM_ICONS);
		
		
		
/********** WELCOME ***********************************************************/
		
		$("#welcome-page .connect-btn").click(function() {
			app.changePage("#sign-in-page");
		});
		
		
		
/********** SIGN IN ***********************************************************/
		
		$("#sign-in-page .back-btn").click(function() {
			app.changePage("#welcome-page");
		});
		
		$("#sign-in-page .refresh-btn").click(function() {
			app.refreshDevices();
		});
		
		$("#sign-in-page .submit-btn").click(function() {
			var device = $("#sign-in-page input[name=\"available-devices\"]:checked");
			
			app.connectedDevice = {
				"device-name" : device.attr("device-name"),
				"address" : device.attr("address"),
			};
			
			app.changePage("#profiles-page");
			
			/*if (app.connectedDevice != undefined) {
				
				var name = $("#signInPage input[name='name']").val();
				var password = $("#signInPage input[name='password']").val();
			
				if(app.arduino.signInUser(name, password)) {
					app.activeUser = name;
					alert("Hi " + app.activeUser + "!");
					app.changePage("#profilesPage");
				}
				else {
					alert("Error: login failed");
				}
			}
			else
				alert("Error: device not found");*/
		});
		
		
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
			app.arduino.getProfile($(this).children(".profile").attr("id"))
			.then(function(result) {
				var response = JSON.parse(result);

				if (response.outcome == "success") {
					app.currentProfile = response.profile;

					if (app.editProfilesMode) {
						app.changePage("#edit-profile-page");
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
		
		$("#edit-profile-page .back-btn").click(function() {
			app.currentProfile = undefined;
			app.cleanupEditProfilePage();
			app.changePage("#profiles-page");
		});
		
		$("#edit-profile-page .confirm-btn").click(function() {
			var newProfile = {
				name : app.dePrettyfy($("#edit-profile-page .profile-name").val()),
				avatar : $("#edit-profile-page .profile-avatar").attr('name'),
			};
			
			if (newProfile.name != "" &&
					!newProfile.name.includes(" ") &&
					newProfile.avatar != "") {
				app.arduino.editProfile(app.currentProfile, newProfile)
				.then(function(response) {
					var outcome = JSON.parse(response).outcome;

					if (outcome == "success") {
						//alert("Profile saved successfully");

						app.currentProfile = undefined;
						app.cleanupEditProfilePage();
						app.changePage("#profiles-page");
					}
					else {
						alert(JSON.parse(response).error);
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
		
		$("#edit-profile-page .remove-btn").click(function() {
			app.arduino.removeProfile(app.currentProfile)
			.then(function(response) {
				var outcome = JSON.parse(response).outcome;

				if (outcome == "success") {
					app.currentProfile = undefined;
					app.cleanupEditProfilePage();
					app.changePage("#profiles-page");
				}
				else {
					alert(JSON.parse(response).error);
				}
			})
			.catch(function() {
				alert("removeProfile::error");
			});
		});

		
/********** ADD PROFILE *******************************************************/
		
		$("#add-profile-page .back-btn").click(function() {
			app.cleanupAddProfilePage();
			app.changePage("#profiles-page");
		});
		
		$("#add-profile-page .confirm-btn").click(function() {
			var profile = {
				name : app.dePrettyfy($("#add-profile-page .profile-name").val()),
				avatar : $("#add-profile-page .profile-avatar").attr('name'),
			};
			
			if (profile.name != "" &&
					!profile.name.includes(" ") &&
					profile.avatar != "") {
				app.arduino.addProfile(profile)
				.then(function(response) {
					var outcome = JSON.parse(response).outcome;

					if (outcome == "success") {

						app.cleanupAddProfilePage();
						app.changePage("#profiles-page");
					}
					else {
						alert(JSON.parse(response).error);
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
		
		// TODO: ADD IN A FUTURE RELEASE
		
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
			let roomId = $(this).parent().attr("room-id");
			let profileId = app.currentProfile.id;
			try {
				let response1 = JSON.parse(await app.arduino.getRoom(
						roomId,
						profileId));

				if (response1.outcome == "success") {
					app.currentRoom = response1.room;

					if (app.editRoomsMode) {
						app.changePage("#edit-room-page");
					}
					else {
						try {
							let response = JSON.parse(
									await app.arduino.getActiveSmartsets(roomId));
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
											profileId));

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
			app.arduino.getRoom(
					$(this).parent().attr("room-id"),
					app.currentProfile.id)
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
						app.currentProfile));

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
		
		$("#edit-room-page .back-btn").click(function() {
			app.currentRoom = undefined;
			app.cleanupEditRoomPage();
			app.changePage("#control-panel-page");
		});
		
		$("#edit-room-page .confirm-btn").click(function() {
			var newRoom = {
				name : app.dePrettyfy($("#edit-room-page .room-name").val()),
				icon : $("#edit-room-page .room-icon").attr('name'),
			};
			
			if (newRoom.name != "" &&
					!newRoom.name.includes(" ") &&
					newRoom.icon != undefined) {
				app.arduino.editRoom(app.currentRoom, newRoom)
				.then(function(response) {
					var outcome = JSON.parse(response).outcome;

					if (outcome == "success") {
						//alert("Room saved successfully");

						app.currentRoom = undefined;
						app.cleanupEditRoomPage();
						app.changePage("#control-panel-page");
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
		
		$("#edit-room-page .remove-btn").click(function() {
			app.arduino.removeRoom(app.currentRoom)
			.then(function(response) {
				var outcome = JSON.parse(response).outcome;

				if (outcome == "success") {
					app.currentRoom = undefined;
					app.cleanupEditRoomPage();
					app.changePage("#control-panel-page");
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
		
		$("#add-room-page .back-btn").click(function() {
			app.cleanupAddRoomPage();
			app.changePage("#control-panel-page");
		});
		
		$("#add-room-page .confirm-btn").click(function() {
			var room = {
				name : app.dePrettyfy($("#add-room-page .room-name").val()),
				icon : $("#add-room-page .room-icon").attr('name'),
			};
			
			if (room.name != "" &&
					!room.name.includes(" ") &&
					room.icon != undefined) {
				app.arduino.addRoom(room)
				.then(function(response) {
					var outcome = JSON.parse(response).outcome;

					if (outcome == "success") {

						app.cleanupAddRoomPage();
						app.changePage("#control-panel-page");
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
		
		$('#add-room-page').on("click", ".icon-btn", function() {
			$('#add-room-page .room-icon').attr(
					'name',
					$(this).find('.icon').attr('name'));
			$('#add-room-page .room-icon').attr(
					'src',
					$(this).find('img').attr('src'));
		});
		
		
/********** MANUAL PANEL *****************************************************/
		
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
		
		$("#manual-panel-page")
		.on("click", ".view-saved-smartsets-btn", function() {
			app.changePage('#smartsets-page');
		});
		
		$("#manual-panel-page")
		.on("click", ".item .item-active-btn", async function() {
			var itemId = $(this).parents('.item').attr("item-id");
			
			if (app.editItemsMode) {
				try {
					let response = JSON.parse(await app.arduino.getItem(
							itemId,
							app.currentRoom,
							app.currentProfile));
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
				var itemActive;
				if ($(this).parent().attr("active") == "true") {
					itemActive = "false";
				}
				else {
					itemActive = "true";
				}
				
				app.arduino.setItemActive(itemId, itemActive, app.currentRoom)
				.then(function(result) {
					var response = JSON.parse(result);

					if (response.outcome == "success") {
						$("#manual-panel-page #" + itemId).attr(
								"active", response.active);
						// TODO: change appearance
					}
					else if (response.outcome == "partial_success") {
						$("#manual-panel-page #" + itemId).attr(
								"active", response.active);
						alert(response.message);
						// TODO: change appearance
					}
					else {
						alert(response.error);
					}
				})
				.catch(function() {
					alert("turnOnItem::error");
				});
			}
		});
		
		$("#manual-panel-page .add-btn").click(function() {
			app.changePage("#add-item-page");
		});
		
		$("#manual-panel-page")
		.on("click", ".item .smart .on-btn", function() {
			app.currentItem = {
				id : $(this).parents(".item").attr('id'),
				active : $(this).parents(".item").attr('active'),
			};
			app.refreshSmartsetsPanel();
			$('#manual-panel-page .smartsets-panel').css('display', 'block');
			/*app.arduino.getSmartsets(app.currentProfile, app.currentRoom)
			.then(function(result) {
				var response = JSON.parse(result);

				if (response.outcome == "success") {
					app.loadSmartsets(response.smartsets);
					$('#manual-panel-page .smartsets-panel').css('display', 'block');
				}
				else {
					alert(response.error);
					app.currentItem = undefined;
				}
			})
			.catch(function() {
				alert("getSmartsets::error");
				app.currentItem = undefined;
			});*/
		});
		
		$("#manual-panel-page")
		.on("click", ".smartsets-list .smartset a", function() {
			let smartset_id = $(this).parent().attr('id');
			app.arduino.addItemToSmartset(
					smartset_id,
					app.currentItem,
					app.currentProfile,
					app.currentRoom)
			.then(function(result) {
				var response = JSON.parse(result);

				if (response.outcome == "success") {
					$('#manual-panel-page .smartsets-panel').css('display', 'none');
				}
				else {
					alert(response.error);
				}
			})
			.catch(function() {
				alert("addItemToSmartset::error");
			});
		});
		
		$("#manual-panel-page")
		.on("click", ".smartsets-list .smartset a", function() {
			let smartset_id = $(this).parent().attr('id');
			app.arduino.addItemToSmartset(
					smartset_id,
					app.currentItem,
					app.currentProfile,
					app.currentRoom)
			.then(function(result) {
				var response = JSON.parse(result);

				if (response.outcome == "success") {
					$('#manual-panel-page .smartsets-panel').css('display', 'none');
				}
				else {
					alert(response.error);
				}
			})
			.catch(function() {
				alert("addItemToSmartset::error");
			});
		});
		
		$("#manual-panel-page")
		.on("click", ".smartsets-panel .add-to-new-smartset-btn", function() {
			app.changePage('#add-smartset-page');
		});
		
		
/********** EDIT ITEM *********************************************************/
		
		$("#edit-item-page .back-btn").click(function() {
			app.currentItem = undefined;
			app.cleanupEditItemPage();
			app.changePage("#manual-panel-page");
		});
		
		$("#edit-item-page .confirm-btn").click(function() {
			var newItem = {
				"name" : app.dePrettyfy(
						$("#edit-item-page input[name=\"name\"]").val()),
				"icon" : $("#edit-item-page input[name=\"item-icons\"]:checked").val(),
				"port" : $("#edit-item-page .port-select").children("option:selected").val(),
				// TODO: other properties
			};
			
			if (newItem.name != "" && newItem.icon != undefined) {
				app.arduino.editItem(
						app.currentItem,
						newItem,
						app.currentRoom)
				.then(function(result) {
					var response = JSON.parse(result);

					if (response.outcome == "success") {
						//alert("Item saved successfully");

						app.currentItem = undefined;
						app.cleanupEditItemPage();
						app.changePage("#manual-panel-page");
					}
					else {
						alert(response.error);
					}
				})
				.catch(function() {
					alert("editItem::error");
				});
			}
			else {
				alert("invalid data");
			}
		});
		
		$("#edit-item-page .remove-btn").click(function() {
			app.arduino.removeItem(app.currentItem, app.currentRoom)
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
		
		$("#add-item-page .back-btn").click(function() {
			app.cleanupAddItemPage();
			app.changePage("#manual-panel-page");
		});
		
		$("#add-item-page .confirm-btn").click(function() {
			var item = {
				"name" : app.dePrettyfy(
						$("#add-item-page input[name=\"name\"]").val()),
				"icon" : $("#add-item-page input[name=\"item-icons\"]:checked").val(),
				"port" : $("#add-item-page .port-select").children("option:selected").val(),
				// TODO: other properties
			};
			
			if (item.name != "" && item.icon != undefined) {
				app.arduino.addItem(item, app.currentRoom)
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
		
/********** SMARTSETS *********************************************************/
		
		$("#smartsets-page .back-btn").click(function() {
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
		});
		
/********** ADD SMARTSET ******************************************************/
		
		$("#add-smartset-page .back-btn").click(function() {
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
							
											// TODO: cleanup
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
							// TODO: cleanup
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
		});
		
/********** EDIT SMARTSET *****************************************************/
		
		$("#edit-smartset-page .back-btn").click(function() {
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
						// TODO: cleanup
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
					// TODO: cleanup
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
		});
		
		
/********** SMART ITEMS *******************************************************/
		
		$("#smart-items-page .back-btn").click(function() {
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
		});
		
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
	
	refreshProfilesList: function() {
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
	},
	
	loadProfilesList: function(profiles) {
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
							'ui-btn ' +/*'ui-icon-edit ui-btn-icon-top" '*/
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
			container.html("<p>TODO</p>");
		}
	},
	
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
	
	refreshItemIcons: function(icons) {
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
	},
	
	refreshRooms: function() {
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
	},
	
	loadRooms: function(rooms, container) {
		container.html("");
		for (let index = 0; index < rooms.length; index++) {
			let room = rooms[index];
			container.append(
				'<li class="room" room-id="' + room.id + '" smart="false">' +
					'<a class="room-smart-btn">' +
						'<img class="room-icon"' +
								'src="img/rooms/' + room.icon + '.png">' +
						'<h2 class="room-name">' + room.name + '</h2>' +
				
						/*<img class="active-profile-avatar"
								src="img/profiles/avatar-0.png"
								width="50px" height="50px">
						<img class="active-profile-avatar"
								src="img/profiles/avatar-1.png"
								width="50px" height="50px">
						<img class="active-profile-avatar"
								src="img/profiles/avatar-2.png"
								width="50px" height="50px">
						<img class="active-profile-avatar"
								src="img/profiles/avatar-3.png"
								width="50px" height="50px">
						<img class="active-profile-avatar"
								src="img/profiles/avatar-4.png"
								width="50px" height="50px">
						<img class="active-profile-avatar"
								src="img/profiles/avatar-0.png"
								width="50px" height="50px">
						<img class="active-profile-avatar"
								src="img/profiles/avatar-1.png"
								width="50px" height="50px">
						<img class="active-profile-avatar"
								src="img/profiles/avatar-2.png"
								width="50px" height="50px">*/
				
					'</a>' +
					'<a class="room-manual-btn" data-icon="gear"></a>' +
				'</li>'
			);
				/*'<div ' +
					'class="room" ' +
					'id="' + room.id + '" ' +
					'smart="false" ' +
				'>' +
					'<a class="ui-btn">' +
						'<img src="img/rooms/' + room.icon +
						'.png" width="130px" height="130px"/>' +
						'<h3>' + app.prettyfy(room.name) + '</h3>' +
					'</a>' +
					'<div class="active-profiles">' +
					'</div>' +
				'</div>'*/
			
			/*for (let j = 0; j < room.smartsets.length; j++) {
				let owner = room.smartsets[j].owner;
				
				$("#" + room.id + " .active-profiles").append(
					'<div class="active-profile"' +
							'id="' + owner.id + '"' +
					'>' +
						app.prettyfy(owner.name) +
					'</div>'
				);
				
				if (owner.id == app.currentProfile.id) {
					$("#" + room.id).attr('smart', 'true');
				}
			}*/
		}
		
		container.listview("refresh");
		
		if (container.html() == "") {
			container.html("<p>There aren't any rooms yet</p>");
		}
	},
	
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
		else {
			alert('isOpen::error - target not found');
		}
	},
	
	
/********** OPEN **************************************************************/
	
	open: function(selector) {
		let target = $(selector);
		
		if (target.is($('#control-panel-page .footer'))) {
			return target.animate({
				'top': $(window).height() - target.height(),
			}, 300).promise();
		}
		else {
			alert('open::error - target not found');
		}
	},
	
/********** CLOSE *************************************************************/
	
	close: function(selector) {
		let target = $(selector);
		
		if (target.is($('#control-panel-page .footer'))) {
			return target.animate({
				'top': $(window).height(),
			}, 300).promise();
		}
		else {
			alert('close::error - target not found');
		}
	},	
	
/********** REFRESH ***********************************************************/
	
	refresh: async function(selector) {
		let target = $(selector);
		
		if (target.is($("#control-panel-page .footer .smartsets"))) {
			return app.arduino.getSmartsets(app.currentProfile, app.currentRoom)
			.then(function(result) {
				var response = JSON.parse(result);

				if (response.outcome == "success") {
					app.load(target, response.smartsets);
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
				let response = JSON.parse(
						await app.arduino.getRooms(currentProfileId));
				if (response.outcome != "success") {
					alert(response.error);
					return;
				}
				app.load(target, response.rooms);
				let cachedProfiles = [];
				for (let room of response.rooms) {
					try {
						let response = JSON.parse(
								await app.arduino.getActiveSmartsets(room.id));
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
									let response = JSON.parse(
											await app.arduino.getProfile(smartset.owner_id));
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
								$(selector + ' .room[room-id="' + room.id + '"] .room-smart-btn').addClass('enhanced');
							}
						}
						let innerSelector = '.room[room-id="' + room.id + '"] .active-profiles';
						let target = $(selector + ' ' + innerSelector);
						app.load(target, activeProfiles);
					}
					catch (e) {
						alert('getActiveSmartsets::error');
					}
				}
			}
			catch (e) {
				alert('getRooms::error');
			}
		}
		
		else if (target.is($("#manual-panel-page .items"))) {
			try {
				let response = JSON.parse(
						await app.arduino.getItems(
								app.currentRoom,
								app.currentProfile));
				if (response.outcome == "success") {
					app.load(target, response.items);
				}
				else {
					alert(response.error);
				}
			}
			catch (error) {
				alert("getItems::error");
			}
		}
		
		else if (target.is($("#add-item-page .port-select")) ||
				target.is($("#edit-item-page .port-select"))) {
			try {
				let response = JSON.parse(await app.arduino.getPorts());
				if (response.outcome != "success") {
					alert(response.error);
					return;
				}
				app.load(target, response.ports);
			}
			catch(error) {
				alert("getPorts::error");
			}
		}
		
		else {
			alert('refresh::error - target not found');
		}
	},
	
	
/********** LOAD **************************************************************/
	
	load: function(target, data) {
		
		if (target.is($("#add-profile-page .avatars")) ||
				target.is($("#edit-profile-page .avatars"))) {
			target.html("");
			for (let i = 0; i < data.length; i++) {
				target.append(
						'<div class="centered-list-block ui-block-' + app.toBlockType(i % 5) + '">' +
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
				let prettifiedName = app.prettyfy(smartset.name);
				target.append(
					'<li ' +
						'class="smartset" ' +
						'data-icon="false" ' +
						'smartset-id="' + smartset.id + '" ' +
					'>' +
						'<a class="smartset-btn">' +
							'<h3 class="smartset-name">' +
								prettifiedName +
							'</h3>' +
						'</a>' +
					'</li>'
				);
			}
			target.listview("refresh");
		}
		
		else if (target.is($("#control-panel-page .rooms"))) {
			target.html("");
			for (let i = 0; i < data.length; i++) {
				let room = data[i];
				target.append(
					'<li class="room" room-id="' + room.id + '" smart="false">' +
						'<a class="room-smart-btn">' +
							'<img class="room-icon"' +
									'src="img/rooms/' + room.icon + '.png">' +
							'<h2 class="room-name">' + room.name + '</h2>' +
							'<div class="active-profiles"></div>' +
						'</a>' +
						'<a class="room-manual-btn" data-icon="gear"></a>' +
					'</li>'
				);
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
		
		else if (target.is($("#add-room-page .icons")) ||
				target.is($("#edit-room-page .icons"))) {
			target.html("");
			for (let i = 0; i < data.length; i++) {
				target.append(
						'<div class="centered-list-block ui-block-' + app.toBlockType(i % 5) + '">' +
							'<a class="icon-btn ui-btn">' +
								'<img class="icon" name="' + data[i] + '" ' +
										'src=\"img/rooms/' + data[i] + '.png\" ' +
										'width=\"70px\" height=\"70px\" ' +
								'>' +
							'</a>' +
						'</div>');
			}
		}
		
		else if (target.is($("#manual-panel-page .items"))) {
			target.html("");
			for (let i = 0; i < data.length; i++) {
				target.append(
					'<li class="item" ' +
							'item-id="' + data[i].id + '" ' +
							'active="' + data[i].active + '" ' +
					'>' +
						'<div class="item-inner">' +
							'<a class="item-active-btn ui-btn">' +
								'<img src="img/items/' + data[i].icon + '.png"' +
										'width="60px" height="60px"/>' +
							'</a>' +
							'<h2 class="item-name">' + app.prettyfy(data[i].name) + '</h2>' +
							'<a class="item-smart-btn ui-btn ui-btn-right ui-icon-heart ui-btn-icon-notext"></a>' +
						'</div>' +
					'</li>');
			}
			target.listview("refresh");
		}
		
		else if (target.is($("#add-item-page .port-select")) ||
				target.is($("#edit-item-page .port-select"))) {
			target.html("");
			if (app.currentItem != undefined &&
					app.currentItem.port != "none") {
				target.append(
					"<option value=\"" + app.currentItem.port + "\">" +
					app.prettyfy(app.currentItem.port) + "</option>");
			}

			target.append("<option value=\"none\">none</option>");
			
			for (let i = 0; i < data.length; i++) {
				target.append(
					"<option value=\"" + data[i].name + "\">" +
					app.prettyfy(data[i].name) + "</option>");
			}
			
			// i don't know why, but it works...
			target.trigger("change");
			target.selectmenu();
			target.selectmenu('refresh', true);
		}
		
		else {
			console.log('load::error - target not found');
		}
	},
	
	refreshActivateSmartsetPanel: function() {
		app.arduino.getSmartsets(app.currentProfile, app.currentRoom)
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
		app.arduino.getSmartsets(app.currentProfile, app.currentRoom)
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
			$("#control-panel-page .room-smart-btn").addClass('obscured');
			$("#control-panel-page .room-smart-btn").addClass('ui-icon-edit ui-btn-icon-left');
		}
		else {
			$("#control-panel-page .room-smart-btn").removeClass('obscured');
			$("#control-panel-page .room-smart-btn").removeClass('ui-icon-edit ui-btn-icon-left');
		}
		app.editRoomsMode = value;
	},
	
	setEditItemsMode: function(value) {
		if (value) {
			// TODO: change appearances
		}
		else {
			// TODO: change appearances
		}
		app.editItemsMode = value;
	},
	
	changePage: function(destination) {
		$.mobile.navigate(destination);
		
		switch(destination) {
				
		case "#sign-in-page":
		//case "#registerPage":
			app.refreshDevices();
			break;
				
		case "#profiles-page":
			if (app.editProfilesMode) {
				app.setEditProfilesMode(false);
			}
			
			app.refreshProfilesList();
			/*app.arduino.getProfiles()
				.then(function(result) {
					var response = JSON.parse(result);
				
					if (response.outcome == "success") {
						//alert(JSON.stringify(result));
						app.refreshProfiles(response.profiles);
					}
					else {
						alert(response.error);
					}
				})
				.catch(function() {
					alert("getProfiles::error");
				});*/
			break;
				
		case "#add-profile-page":
			$('#add-profile-page .profile-avatar').attr(
					'name',
					app.profileAvatars[0]);
			$('#add-profile-page .profile-avatar').attr(
					'src',
					'img/profiles/' + app.profileAvatars[0] + '.png');
			app.load($('#add-profile-page .avatars'), app.profileAvatars);
			break;
				
		case '#edit-profile-page':
			$('#edit-profile-page .profile-avatar').attr(
					'name',
					app.currentProfile.avatar);
			$('#edit-profile-page .profile-avatar').attr(
					'src',
					'img/profiles/' + app.currentProfile.avatar + '.png');
			$('#edit-profile-page .profile-name').val(
					app.currentProfile.name);
			app.load($('#edit-profile-page .avatars'), app.profileAvatars);
			break;
				
		case "#sign-in-profile-page":
			app.refreshProfileInfo(app.currentProfile);
			break;
				
		case "#control-panel-page":
			if (app.editRoomsMode) {
				app.setEditRoomsMode(false);
			}
			//app.refreshRooms();
			app.refresh('#control-panel-page .rooms');
			break;
				
		case "#add-room-page":
			$('#add-room-page .room-icon').attr(
					'name',
					app.roomIcons[16]);
			$('#add-room-page .room-icon').attr(
					'src',
					'img/rooms/' + app.roomIcons[16] + '.png');
			app.load($('#add-room-page .icons'), app.roomIcons);
			break;
				
		case '#edit-room-page':
			$('#edit-room-page .room-icon').attr(
					'name',
					app.currentRoom.icon);
			$('#edit-room-page .room-icon').attr(
					'src',
					'img/rooms/' + app.currentRoom.icon + '.png');
			$('#edit-room-page .room-name').val(
					app.currentRoom.name);
			app.load($('#edit-room-page .icons'), app.roomIcons);
			break;
				
		case "#manual-panel-page":
			if (app.editItemsMode)
				app.setEditItemsMode(false);
				
			app.arduino.getItems(
					app.currentRoom,
					app.currentProfile)
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
			});
			break;
				
		case "#add-item-page":
			app.refresh('#add-item-page .port-select');
			break;
				
		case "#edit-item-page":
			/*$("#edit-item-page input[name=\"name\"]").val(app.prettyfy(
					app.currentItem.name));
			$("#edit-item-page .port-select option[value=\"" +
					app.currentItem.port + "\"]").prop("selected", true);
			$("#edit-item-page input[name=\"item-icons\"][value=\"" +
					app.currentItem.icon + "\"]")
				.prop("checked", true)
				.checkboxradio("refresh");*/
			app.refresh('#edit-item-page .port-select');
			break;
			
		case "#smartsets-page":
			app.arduino.getSmartsets(app.currentProfile, app.currentRoom, "null")
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
			break;
		default:
		}
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
		
		searchDevices: function() {
			/* search for WiFi devices and returns the list of the 
			 * currently available devices
			 */
			var networkAddress =
					$("#sign-in-page .local-ip-1").val() + "." +
					$("#sign-in-page .local-ip-2").val() + "." +
					$("#sign-in-page .local-ip-3").val() + ".";
			
			//for (var hostAddress = 1; hostAddress < 254; hostAddress++) {
			/* DEBUG */ for (var hostAddress = app.debugHost; hostAddress < app.debugHost + 1; hostAddress++) {
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
		},
		
		/*connect: function(device) {
			// TODO: connects to the selected device
			return true;
		},*/
		
		signInUser: function(/*name, password*/) {
			/* TODO: check if the user exists in the device and if the password is 
			 * correct. If the combination is correct it returns TRUE, otherwise 
			 * FALSE
			 */
			return true;
		},
		
		registerUser: function(/*name, password*/) {
			/* TODO: check if an user with the specified name already exists in 
			 * the device. If it doesn't exist it returns TRUE, otherwise FALSE
			 */
			return true;
		},
		
		signInProfile: function(/*name, password*/) {
			/* TODO: 
			 */
			return true;
		},
		
		// TODO: add "device" parameter
		/*
		getProfiles: function() {
			return new Promise((resolve, reject) => {
				return $.getJSON({
					url: "http://" + app.connectedDevice.address +
							"/profiles/",
					success: resolve,
					error: reject,
				});
			});
		},
		*/
		
		request: function(method, url, data) {
			if (data) {
				return new Promise((resolve, reject) => {
					return $.ajax({
						type: method,
						url: url,
						data: data + "\n\n",
						success: resolve,
						error: reject,
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
					});
				});
			}
		},
		
		getProfiles: function() {
			return app.arduino.request(
					"GET",
					"http://" + app.connectedDevice.address +
							"/profiles/");
		},
		
		getProfile: function(profileId) {
			return app.arduino.request(
					"GET",
					"http://" + app.connectedDevice.address +
							"/profiles/" + profileId);
		},
		
		getRooms: function(profileId) {
			return app.arduino.request(
					"GET",
					"http://" + app.connectedDevice.address +
							"/rooms/",
					"profile_id=" + profileId);
		},
		
		getRoom: function(roomId, profileId) {
			return app.arduino.request(
					"GET",
					"http://" + app.connectedDevice.address +
							"/rooms/" + roomId,
					"profile_id=" + profileId);
		},
		
		getItems: function(room, profile) {
			return app.arduino.request(
					"GET",
					"http://" + app.connectedDevice.address +
							"/items/",
					"room_id=" + room.id + "&" +
							"profile_id=" + profile.id);
		},
		
		getItem: function(itemId, room, profile) {
			return app.arduino.request(
					"GET",
					"http://" + app.connectedDevice.address +
							"/items/" + itemId,
					"room_id=" + room.id + "&" +
							"profile_id=" + profile.id);
		},
		
		getSmartsets: function(profile, room) {
			return app.arduino.request(
					"GET",
					"http://" + app.connectedDevice.address +
							"/smartsets/",
					"profile_id=" + profile.id + "&" +
							"room_id=" + room.id + "&" +
							"item_id=" + 'null');
		},
		
		getActiveSmartsets: function(roomId) {
			return app.arduino.request(
					"GET",
					"http://" + app.connectedDevice.address +
							"/active_smartsets/",
					"room_id=" + roomId);
		},
		
		getSmartset: function(smartset_id, profile, room) {
			return app.arduino.request(
					"GET",
					"http://" + app.connectedDevice.address +
							"/smartsets/" + smartset_id,
					"profile_id=" + profile.id + "&" +
							"room_id=" + room.id + "&");
		},
		
		getSmartsetByName: function(smartset_name, room, profile) {
			return app.arduino.request(
					"GET",
					"http://" + app.connectedDevice.address +
							"/smartsets/",
					"smartset_name=" + smartset_name + "&" +
							"room_id=" + room.id + "&" +
							"profile_id=" + profile.id + "&");
		},
		
		getSmartItems: function(profile, room, smartset) {
			return app.arduino.request(
					"GET",
					"http://" + app.connectedDevice.address +
							"/smart_items/",
					"profile_id=" + profile.id + "&" +
							"room_id=" + room.id + "&" +
							"smartset_id=" + smartset.id + "&");
		},
		
		// TODO: test
		getSmartItem: function(smartItemId, profile, room, smartset) {
			return app.arduino.request(
					"GET",
					"http://" + app.connectedDevice.address +
							"/smart_items/" + smartItemId,
					"profile_id=" + profile.id + "&" +
							"room_id=" + room.id + "&" +
							"smartset_id=" + smartset.id + "&");
		},
		
		getPorts: function() {
			return app.arduino.request(
					"GET",
					"http://" + app.connectedDevice.address +
							"/ports/");
		},
		
		addProfile: function(newProfile) {
			return app.arduino.request(
					"POST",
					"http://" + app.connectedDevice.address + "/profiles/" +
							"?action=add",
					JSON.stringify({
						"action": "add",
						"new_profile": newProfile,
					}));
		},
		
		addRoom: function(newRoom) {
			return app.arduino.request(
					"POST",
					"http://" + app.connectedDevice.address +
							"/rooms/" +
							"?action=add",
					JSON.stringify({
						"action": "add",
						"new_room": newRoom,
					}));
		},
		
		addItem: function(newItem, room) {
			return app.arduino.request(
					"POST",
					"http://" + app.connectedDevice.address +
							"/items/" +
							"?action=add",
					JSON.stringify({
						"action": "add",
						"new_item": newItem,
						"room_id": room.id,
					}));
		},
		
		// TODO: test
		addSmartset: function(newSmartset, room, profile) {
			return app.arduino.request(
					"POST",
					"http://" + app.connectedDevice.address +
							"/smartsets/" +
							"?action=add",
					JSON.stringify({
						action: "add",
						new_smartset: newSmartset,
						room_id: room.id,
						profile_id: profile.id,
					}));
		},
		
		editProfile: function(profile, newProfile) {
			return app.arduino.request(
					"POST",
					"http://" + app.connectedDevice.address +
							"/profiles/" + profile.id +
							"?action=edit",
					JSON.stringify({
						"action": "edit",
						"profile_id": profile.id,
						"new_profile": newProfile,
					}));
		},
		
		editRoom: function(room, newRoom) {
			return app.arduino.request(
					"POST",
					"http://" + app.connectedDevice.address +
							"/rooms/" + room.id +
							"?action=edit",
					JSON.stringify({
						"action": "edit",
						"room_id": room.id,
						"new_room": newRoom,
					}));
		},
		
		editItem: function(item, newItem, room) {
			return app.arduino.request(
					"POST",
					"http://" + app.connectedDevice.address +
							"/items/" + item.id +
							"?action=edit",
					JSON.stringify({
						"action": "edit",
						"item_id": item.id,
						"new_item": newItem,
						"room_id": room.id,
					}));
		},
		
		// TODO: test
		editSmartset: function(smartset, newSmartset, room, profile) {
			return app.arduino.request(
					"POST",
					"http://" + app.connectedDevice.address +
							"/smartsets/" + smartset.id +
							"?action=edit",
					JSON.stringify({
						"action": "edit",
						"smartset_id": smartset.id,
						"new_smartset": newSmartset,
						"room_id": room.id,
						"profile_id": profile.id,
					}));
		},
		
		removeProfile: function(profile) {
			return app.arduino.request(
					"POST",
					"http://" + app.connectedDevice.address +
							"/profiles/" + profile.id +
							"?action=remove",
					JSON.stringify({
						"action": "remove",
						"profile_id": profile.id,
					}));
		},
		
		removeRoom: function(room) {
			return app.arduino.request(
					"POST",
					"http://" + app.connectedDevice.address +
							"/rooms/" + room.id +
							"?action=remove",
					JSON.stringify({
						"action": "remove",
						"room_id": room.id,
					}));
		},
		
		removeItem: function(item, room) {
			return app.arduino.request(
					"POST",
					"http://" + app.connectedDevice.address +
							"/items/" + item.id +
							"?action=remove",
					JSON.stringify({
						"action": "remove",
						"item_id": item.id,
						"room_id": room.id,
					}));
		},
		
		// TODO: test
		removeSmartset: function(smartsetId, room, profile) {
			return app.arduino.request(
					"POST",
					"http://" + app.connectedDevice.address +
							"/smartsets/" + smartsetId +
							"?action=remove",
					JSON.stringify({
						"action": "remove",
						"room_id": room.id,
						"profile_id": profile.id,
					}));
		},
		
		setItemActive: function(itemId, itemActive, room) {
			return app.arduino.request(
					"POST",
					"http://" + app.connectedDevice.address +
							"/items/" + itemId +
							"?action=set_status",
					JSON.stringify({
						"action": "set_status",
						"item_id": itemId,
						"item_active": itemActive,
						"room_id": room.id,
					}));
		},
		
		// TODO: test
		addItemToSmartset: function(smartset_id, item, profile, room) {
			return app.arduino.request(
					"POST",
					"http://" + app.connectedDevice.address +
							"/smartsets/" + smartset_id +
							"?action=add_item",
					JSON.stringify({
						"action": "add_item",
						item : item,
						profile_id : profile.id,
						room_id : room.id,
					}));
		},
		
		// TODO: test
		removeItemFromSmartset: function(itemId, smartset, room, profile) {
			return app.arduino.request(
					"POST",
					"http://" + app.connectedDevice.address +
							"/smartsets/" + smartset.id +
							"?action=remove_item",
					JSON.stringify({
						"action": "remove_item",
						item_id : itemId,
						room_id : room.id,
						profile_id : profile.id,
					}));
		},
		
		activateSmartset: function(smartsetId, room, profile) {
			return app.arduino.request(
					"POST",
					"http://" + app.connectedDevice.address +
							"/rooms/" + room.id +
							"?action=activate_smartset",
					JSON.stringify({
						"action": "activate_smartset",
						smartset_id : smartsetId,
						room_id : room.id,
						profile_id : profile.id,
					}));
		},
		
		deactivateSmartset: function(smartsetId, roomId, profileId) {
			return app.arduino.request(
					"POST",
					"http://" + app.connectedDevice.address +
							"/rooms/" + roomId +
							"?action=deactivate_smartset",
					JSON.stringify({
						action: "deactivate_smartset",
						smartset_id : smartsetId,
						room_id : roomId,
						profile_id : profileId,
					}));
		},
		
		/*setRoomSmart: function(roomId, roomSmart, profile) {
			return app.arduino.request(
					"POST",
					"http://" + app.connectedDevice.address +
							"/rooms/" + roomId +
							"?action=set_smart",
					JSON.stringify({
						"action": "set_smart",
						"room_id": roomId,
						"room_smart": roomSmart,
						"profile_id" : profile.id,
					}));
		},*/
		
		/*setItemSmart: function(itemId, itemSmart, itemActive, room, profile) {
			return app.arduino.request(
					"POST",
					"http://" + app.connectedDevice.address +
							"/items/" + itemId +
							"?action=set_smart",
					JSON.stringify({
						"action": "set_smart",
						"item_id": itemId,
						"item_smart": itemSmart,
						"item_active": itemActive,
						"room_id": room.id,
						"profile_id" : profile.id,
					}));
		},*/
	},
};