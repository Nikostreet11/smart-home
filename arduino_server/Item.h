#ifndef ITEM_H_
#define ITEM_H_

#include <WString.h>
#include <LinkedPointerList.h>
//#include "PortManager.h"
#include "IdManager.h"
#include "Binary.h"
#include "Linear.h"

class Item
{
public:
	// static constructors
	static Item* create(/*PortManager& portManager*/);
	
	// destructor
	virtual ~Item();

	// operations
	bool isControlNameAvailable(const String& name);
	bool addControl(Control* control);
	bool removeControl(int index);

	// getters / setters
	Control* getControl(int index);
	Control* getControl(const String& name);
	int getControlsIndex(const String& name);
	int getControlsSize();
	
	int getTrueId() const;
	String getId() const;
	const String& getName() const;
	void setName(const String& name);
	const String& getIcon() const;
	void setIcon(const String& icon);
	//const String& getPort() const;
	//void setPort(const String& port);
	bool isActive() const;
	void setActive(bool active);

	// static constants
	static const int MAX_ITEMS = 64;
	static const int MAX_CONTROLS = 8;
	
private:
	// constructor
	Item(/*PortManager& portManager*/);

	// static resources
    static IdManager idManager;

	// resources
	//PortManager& portManager;
	LinkedPointerList<Control> controls;
	
	// variables
	int id;
	String name;
	String icon;
	//String port;
	bool active;
};

#endif /* ITEM_H_ */
