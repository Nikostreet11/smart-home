#ifndef CONTROL_H_
#define CONTROL_H_

#include <WString.h>
#include "PortManager.h"

class Control
{
public:
	enum class Type {Binary, Linear};
	
	// constructors
	//Control(PortManager& portManager);
	Control(PortManager& portManager, String name/*, String port*/);
	
	// destructor
	virtual ~Control() = 0;
	
	// getters / setters
	virtual Type getType() = 0;
	virtual const String& getStringType() const = 0;;
	virtual void updatePort() = 0;
	const String& getName() const;
	const String& getPort() const;
	void setPort(const String& port);
	//bool isActive() const;
	void setActive(bool active);
	
protected:
	// resources
	PortManager& portManager;
	
	// variables
	String name;
	String port;
	bool active;
};

#endif /* CONTROL_H_ */
