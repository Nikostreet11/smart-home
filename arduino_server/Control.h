#ifndef CONTROL_H_
#define CONTROL_H_

#include <SPI.h>
#include <WString.h>
#include "PortManager.h"
#include "IdManager.h"

// forward declarations
class SmartControl;

class Control
{
public:
	enum class Type {Binary, Linear};
	
	// destructor
	virtual ~Control();

	// operations
	virtual Type getType() = 0;
	virtual String getStringType() const = 0;
	virtual void updatePort() = 0;
	virtual bool updateFrom(SmartControl* origin) = 0;
	virtual void setDefault() = 0;
	
	// getters / setters
	int getTrueId() const;
	String getId() const;
	const String& getName() const;
	void setName(const String& name);
	const String& getPort() const;
	void setPort(const String& port);
	//bool isActive() const;
	void setActive(bool active);

	// static constants
	static const int MAX_CONTROLS = 128;
	
protected:
	// internal
	static int toTrueId(String id);
	
	// constructors
	Control(PortManager& portManager, bool active);
	Control(PortManager& portManager, bool active, int id);

	// static resources
    static IdManager idManager;
	
	// resources
	PortManager& portManager;
	
	// variables
	int id;
	String name;
	String port;
	bool active;
};

#endif /* CONTROL_H_ */
